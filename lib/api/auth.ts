type ApiError = {
    error:string,
    issues?:{field:string; message:string}
}


async function handleResponse(res:Response){
    const data = await res.json()

    if(!res.ok) {throw data as ApiError
    }
    console.log(data)
    return data;
}

export async function login(email:string, password:string) {
    const res =  await fetch("/api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email,password}),
        credentials:"include"
    })
    return handleResponse(res)
}

export async function register(email:string,password:string,name?:string) {
    const res = await fetch("api/auth/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password,name}),
        credentials:"include"
    })

    return handleResponse(res)
}

export async function getUser(){
    const res = await fetch("/api/auth/me",{
        cache:"no-store",
        credentials:"include"
    });

    return handleResponse(res);
}

export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Logout failed")
  }

  return true
}