type ApiError = {
    error:string,
    issues?:{field:string; message:string}
}


async function handleResponse(res:Response){
    const data = await res.json()

    if(!res.ok) {throw data as ApiError
    }

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
    const res = await fetch("api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password,name}),
        credentials:"include"
    })

    return handleResponse(res)
}