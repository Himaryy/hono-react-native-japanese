import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schemas from "./index";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, {
  schema: schemas,
});
