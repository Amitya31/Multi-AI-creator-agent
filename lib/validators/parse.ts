import {  ZodTypeAny } from "zod";

export function parseBody<T extends ZodTypeAny>(
  schema: T,
  body: unknown
): T["_output"] {
  return schema.parse(body);
}
