import { sitemap } from "stoneware";
import { SITE_URL } from "../lib/site.ts";

/**
 * Three pages, listed by hand because three is not enough to be worth deriving.
 * Add a fourth page and this list is the thing that goes stale — move it beside
 * whatever data the routes render before that happens.
 */
export function GET(): Response {
  return sitemap(
    [
      { url: "/", changeFrequency: "monthly", priority: 1 },
      { url: "/reference", changeFrequency: "monthly", priority: 0.8 },
      { url: "/security", changeFrequency: "monthly", priority: 0.8 },
    ],
    { origin: SITE_URL },
  );
}
