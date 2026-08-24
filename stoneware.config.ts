import { defineConfig } from "stoneware";

export default defineConfig({
  port: 3000,
  // Uncomment behind a proxy that terminates TLS (Render, Railway, Fly, nginx)
  // so request URLs report https://. "proto" trusts only the scheme, which is
  // safe anywhere; true also trusts the forwarded host, so use it only when
  // something you control sets that header.
  // trustProxy: "proto",
  // The framework's default Content-Security-Policy applies unless you replace
  // it here. The CSRF secret comes from STONEWARE_CSRF_SECRET in .env - keep it out
  // of this file so it is never committed.
});
