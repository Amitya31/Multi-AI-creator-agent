import { NextRequest } from "next/server";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;

  if (!taskId) {
    return new Response("taskId is required", { status: 400 });
  }

  const redisUrl = process.env.REDIS_URL!;
  const redis = new IORedis(redisUrl, {
    tls: redisUrl.startsWith("rediss://") ? {} : undefined,
    maxRetriesPerRequest: null,
  });

  const channel = `task-events:${taskId}`;

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  let closed = false;

  const send = async (payload: any) => {
    await writer.write(
      encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
    );
  };

  const closeStream = async () => {
    if (closed) return;
    closed = true;
    try {
      await redis.unsubscribe(channel);
      redis.disconnect();
      await writer.close();
    } catch {}
  };

  

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskResults: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!task) {
    await send({ type: "ERROR", message: "Task not found" });
    await closeStream();
    return new Response(stream.readable);
  }

  // Replay step states
  for (const r of task.taskResults) {
    if (r.status === "completed" || r.status === "processing") {
      await send({
        type: "STEP_UPDATED",
        taskId,
        stepIndex: (r.order ?? 1) - 1,
        status: r.status,
        replay: true,
      }); 
    }
  }

  // If already completed → send FINAL_OUTPUT and close
  if (task.status === "completed") {
    const finalResult = task.taskResults[task.taskResults.length - 1];

    let text = "";
    let model = null;
    let usage = null;

    if (finalResult?.contentId) {
      const content = await prisma.content.findUnique({
        where: { id: finalResult.contentId },
      });
      text = content?.body ?? "";
    }

    if (
      finalResult?.output &&
      typeof finalResult.output === "object" &&
      finalResult.output !== null
    ) {
      const out = finalResult.output as any;
      model = out.model ?? null;
      usage = out.usage ?? null;
      if (!text) text = out.text ?? "";
    }

    await send({
      type: "FINAL_OUTPUT",
      taskId,
      content: { text, model, usage },
      replay: true,
    });

    await closeStream();
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  /* --------------------------------------------------
   * 2️⃣ LIVE STREAM FROM REDIS
   * -------------------------------------------------- */

  await redis.subscribe(channel);

  redis.on("message", async (_ch, message) => {
    await writer.write(encoder.encode(`data: ${message}\n\n`));

    try {
      const parsed = JSON.parse(message);
      if (parsed?.type === "FINAL_OUTPUT") {
        await closeStream();
      }
    } catch {}
  });

  req.signal.addEventListener("abort", async () => {
    await closeStream();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
