import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AuthType } from "./lib/auth.js";
import authRouter from "./routes/auth.js";
import progressRoute from "./routes/progress.routes.js";
import profileRoute from "./routes/profile.routes.js";
import friendsRoute from "./routes/friends.routes.js";
import lessonsRoute from "./routes/lessons.route.js";

const app = new Hono<{ Bindings: AuthType }>({ strict: false });

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

export default app;
