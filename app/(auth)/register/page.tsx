"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  register } from "@/lib/api/auth";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function RegisterPage(){
    const router = useRouter();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading,setLoading] = useState<boolean>()
    const [error,setError] = useState<string|null>()
    const [name,setName] = useState("")
    const [showPassword,setShowPassword] = useState<boolean>(false)

    const handleSubmit = async ()=>{
        setError(null);
        setLoading(true);

        try {
            await register(email,password,name)
            router.push("/tasks")
        }catch(err:any){
            setError(err.error || "Login Failed")
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className=" w-[500px] space-y-4">
                <h1 className="text-xl font-semibold" >Register</h1>

                <Input 
                  placeholder="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />

                <div className="flex justify-end">
                  <button className="absolute flex items-center p-2 text-muted-foreground"><Eye size={20}/></button>
                  <Input 
                  placeholder="password"
                  className="relative"
                  type={"password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  
                />
                </div>

                <Input 
                  placeholder="name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />
                
                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading? "Logging in...": "Sign Up"}
                </Button>

                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/login" className="underline">
                      Register
                    </a>
                </p>
            </div>
        </div>
    )
};