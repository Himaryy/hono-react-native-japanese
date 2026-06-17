export function norm(v: string | string[] | undefined): string {
  if (!v) return "?";
  return Array.isArray(v) ? v.join(", ") : v;
}
