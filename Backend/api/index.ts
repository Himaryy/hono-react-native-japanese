import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  let body = "";
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await new Promise<string>((resolve) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    });
  }

  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers.host ?? "localhost";
  const url = `${Array.isArray(proto) ? proto[0] : proto}://${host}${req.url ?? "/"}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const request = new Request(url, {
    method: req.method,
    headers,
    body: body || undefined,
  });

  const response = await app.fetch(request);

  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  const responseBody = await response.text();
  res.end(responseBody);
}
