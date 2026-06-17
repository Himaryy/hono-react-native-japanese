import { hc } from "hono/client";
import type { AppType } from "../../Backend/src/index";

export const api = hc<AppType>(process.env.EXPO_PUBLIC_API_URL!, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, credentials: "include" }),
});
