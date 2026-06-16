import { hc } from "hono/client";
import { AppType } from "../../Backend/src/index";

// RPC from HONO (for TYPES)
export const api = hc<AppType>(process.env.EXPO_PUBLIC_API_URL!);
