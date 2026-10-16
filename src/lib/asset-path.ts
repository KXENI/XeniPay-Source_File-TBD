const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix files from /public when the app is exported below a host subpath
 * (for example, a GitHub Pages project site).
 */
export function assetPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${publicBasePath}${normalizedPath}`;
}
