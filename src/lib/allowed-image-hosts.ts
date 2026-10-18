/**
 * Hostnames allowed for product/store images via `next/image`.
 * Keep this in sync with `images.remotePatterns` in next.config.ts —
 * any image URL outside this list will crash rendering at runtime.
 */
export const ALLOWED_IMAGE_HOSTS = ["picsum.photos"];

export function isAllowedImageUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
