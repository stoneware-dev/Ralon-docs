/**
 * The public origin of this site.
 *
 * Set SITE_URL in the environment for anything that is not local development.
 * Absolute URLs — canonical links, og:image, the sitemap — are built from it.
 */
export const SITE_URL = Bun.env.SITE_URL ?? "http://localhost:3000";

/** Absolute URL for a path on this site. */
export function siteURL(path: string): string {
  return SITE_URL + path;
}
