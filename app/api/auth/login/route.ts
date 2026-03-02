export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { loginSchema } from "@/lib/validators/auth";
import { parseBody } from "@/lib/validators/parse";
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";

export async function POST(req:Request){
    const body = await req.json();

    const {email,password} = parseBody(loginSchema,body);
    const user = await prisma.user.findUnique({where:{email}})

    if(!user || !(await bcrypt.compare(password,user.password))){
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        )
    }

    const token = await signToken(user.id)

    console.log(token)

    const res = NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name
    })

    res.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "lax"
    })

    return res

}