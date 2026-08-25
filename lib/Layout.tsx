import { seo } from "stoneware";
import type { Child } from "stoneware";
import { siteURL } from "./site.ts";

export const VERSION = "0.1.4";

export interface LayoutProps {
  title: string;
  description: string;
  path: string;
  children: Child;
}

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/reference", label: "Reference" },
  { href: "/security", label: "Security" },
  { href: "https://github.com/stoneware-dev/Ralon", label: "GitHub" },
];

/**
 * The document shell. Routes render whole pages in Stoneware, so this is a
 * plain server component rather than a framework layout convention.
 */
export default function Layout({ title, description, path, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {seo({
          title,
          description,
          canonical: siteURL(path),
          themeColor: "#0a0b0d",
          openGraph: { type: "website", siteName: "Ralon" },
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Ralon",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Linux, macOS, Windows",
            softwareVersion: VERSION,
            license: "https://www.apache.org/licenses/LICENSE-2.0",
            description,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        })}
        <link rel="icon" href="/mark.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <header class="masthead">
          <div class="masthead__inner">
            <a class="wordmark" href="/">
              {/* the same lock as the hero, at glyph scale */}
              <svg class="wordmark__lock" viewBox="0 0 200 148" aria-hidden="true">
                <path
                  class="shackle"
                  d="M62 64V40a38 26 0 0 1 76 0v24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="13"
                  stroke-linecap="round"
                />
                <rect
                  x="34"
                  y="62"
                  width="132"
                  height="78"
                  rx="14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="13"
                />
                <path
                  d="M100 92v22"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="13"
                  stroke-linecap="round"
                />
              </svg>
              <b>Ralon</b>
              <span>v{VERSION}</span>
            </a>
            <nav>
              {NAV.map((item) => (
                <a
                  href={item.href}
                  aria-current={item.href === path ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {children}

        <footer class="footer">
          <div class="footer__inner">
            <span>Ralon {VERSION} — Apache-2.0</span>
            <a href="https://github.com/stoneware-dev/Ralon">Source</a>
            <a href="https://crates.io/crates/ralon">crates.io</a>
            <a href="https://www.npmjs.com/package/ralonlock">npm</a>
            <a href="https://pypi.org/project/ralonlock/">PyPI</a>
            <span class="footer__spacer">
              The policy file is <code>agent.lock</code>. It is a format, not a
              product.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
