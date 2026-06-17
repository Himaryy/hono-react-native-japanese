import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthType } from "./lib/auth";
import authRouter from "./routes/auth";
import progressRoute from "./routes/progress.routes";
import profileRoute from "./routes/profile.routes";
import friendsRoute from "./routes/friends.routes";
import lessonsRoute from "./routes/lessons.route";

const app = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "http://localhost:8081",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

const routes = app
  .route("/", authRouter)
  .route("/api/progress", progressRoute)
  .route("/api/profile", profileRoute)
  .route("/api/friends", friendsRoute)
  .route("/api/lessons", lessonsRoute);

// Sharing Type using RPC
export type AppType = typeof routes;

app.get("/", (c) => c.json({ message: "JLPT Backend running!" }));

serve({ fetch: app.fetch, port: 3000, hostname: "0.0.0.0" }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});

export default app;
