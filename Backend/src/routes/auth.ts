import { Hono } from "hono";
import { auth, AuthType } from "../lib/auth.js";

const authRouter = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

authRouter.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default authRouter;
