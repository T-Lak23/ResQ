import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.string().default("development"),
  CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),
  NODEMAILER_USER: z.string().min(1, "NODEMAILER_USER is required"),
  NODEMAILER_PASS: z.string().min(1, "NODEMAILER_PASS is required"),
  NODEMAILER_USER_NAME: z.string().min(1, "NODEMAILER_USER_NAME is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  console.error(z.flattenError(parsedEnv.error).fieldErrors);

  process.exit(1);
}

export const env = parsedEnv.data;
