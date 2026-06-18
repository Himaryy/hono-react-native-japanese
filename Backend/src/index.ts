import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app";

export type AppType = typeof app;

serve({ fetch: app.fetch, port: 3000, hostname: "0.0.0.0" }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});

export default app;
