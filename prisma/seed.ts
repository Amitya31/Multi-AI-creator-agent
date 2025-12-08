// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.$connect();
  console.log("✅ Connected to DB");

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
    },
  });

  console.log("👤 User:", user.email);

  const agents = [
    { name: "Outline Agent", description: "Generates outlines", ownerId: user.id },
    { name: "Writer Agent", description: "Writes articles", ownerId: user.id },
    { name: "SEO Agent", description: "SEO optimization", ownerId: user.id },
    { name: "Title Agent", description: "Generates titles", ownerId: user.id },
    { name: "Summarizer Agent", description: "Summarizes text", ownerId: user.id },
  ];

  const createdAgents = await Promise.all(
    agents.map((agent) =>
      prisma.agent.upsert({
        where: { name: agent.name },
        update: {},
        create: agent,
      })
    )
  );

  console.log("🤖 Agents:", createdAgents.map(a => a.name).join(", "));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Disconnected");
  });
