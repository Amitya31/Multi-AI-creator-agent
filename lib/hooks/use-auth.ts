"use client"
import { useEffect, useState } from "react";

export type AuthUser = {
    email:string,
    password:string,
    name:string,
}

export function useAuth(){
    const [user,setUser] = useState<AuthUser|null>(null)

    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        let mounted = true;

        async function loadUser(){
            try{
                const res = await fetch("/api/auth/me", {
                    credentials: "include"
                })

                if(!mounted) return

                if(res.ok){
                    const data = await res.json();
                    setUser(data)
                } else{
                    setUser(null)
                }
            }catch{
                setUser(null);
            }finally{
                if(mounted) setLoading(false)
            }
        }

        loadUser()

        return ()=>{
            mounted=false
        }
    },[])

    return {
        user,
        loading,
        isAuthenticated: !!user
    }
}