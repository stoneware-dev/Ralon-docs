import type { ActionContext } from "stoneware";
import { siteURL } from "../lib/site.ts";

export function GET(_context: ActionContext): Response {
  const body = `User-agent: *
Allow: /

Sitemap: ${siteURL("/sitemap.xml")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, no-cache" },
  });
}
