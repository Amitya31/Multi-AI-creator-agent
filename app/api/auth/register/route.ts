import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth/jwt";
import { parseBody } from "@/lib/validators/parse";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(req:Request){
    try{
        const body = await req.json()
        const {email,password,name} = parseBody(registerSchema,body);
        const existing = await prisma.user.findUnique({where:{email}})

        console.log(existing)
        if(existing){
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            )
        }

        const hashed = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                email:email,
                password:hashed,
                name:name,
            }
        })

        console.log(user)

        const token = signToken(user.id)
    

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
  }catch(err){
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
    )
  }
}