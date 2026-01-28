import * as z from "zod";

export const emailSchema=z.string().email("Invalid email format")

export const passwordSchema = z.string().min(8,"Password must be atleast 8 characters").max(64,"Password too long");

export const registerSchema = z.object({
    email:emailSchema,
    password: passwordSchema,
    name:z.string().min(2).max(50).optional()
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email:emailSchema,
    password: passwordSchema,
})

export type LoginInput = z.infer<typeof loginSchema>