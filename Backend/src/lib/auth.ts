import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import * as schemas from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schemas,
    usePlural: true,
  }),
  trustedOrigins: ["http://localhost:8081"],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
