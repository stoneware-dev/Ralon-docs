import type { ErrorPageProps } from "stoneware";
import Layout from "../lib/Layout.tsx";

export default function NotFound({ url }: ErrorPageProps) {
  return (
    <Layout
      path="/404"
      title="Not found — Ralon"
      description="Nothing is published at this path."
    >
      <main class="shell">
        <section class="hero">
          <p class="hero__eyebrow">404 · no such path</p>
          <h1>
            Nothing is <mark>published</mark> here.
          </h1>
          <p class="hero__lede">
            <code>{url.pathname}</code> does not exist. It is not locked — it is
            simply not there.
          </p>
          <div class="button-row">
            <a class="button button--primary" href="/">
              Overview
            </a>
            <a class="button" href="/reference">
              Reference
            </a>
            <a class="button" href="/security">
              Security
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
