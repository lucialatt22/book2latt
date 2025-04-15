// src/lib/cloudflare.ts

export function getCloudflareContext() {
  // @ts-ignore - CLOUDFLARE_CONTEXT will exist at runtime
  const env = process.env.CLOUDFLARE_CONTEXT
    ? JSON.parse(process.env.CLOUDFLARE_CONTEXT)
    : {};

  return { env };
}