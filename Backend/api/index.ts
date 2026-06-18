import "dotenv/config";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthType } from "../src/lib/auth";
import authRouter from "../src/routes/auth";
import progressRoute from "../src/routes/progress.routes";
import profileRoute from "../src/routes/profile.routes";
import friendsRoute from "../src/routes/friends.routes";
import lessonsRoute from "../src/routes/lessons.route";

const app = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/", authRouter);
app.route("/api/progress", progressRoute);
app.route("/api/profile", profileRoute);
app.route("/api/friends", friendsRoute);
app.route("/api/lessons", lessonsRoute);

app.get("/", (c) => c.json({ message: "JLPT Backend running!" }));

export default app.fetch;
