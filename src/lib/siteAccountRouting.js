export function normalizeNextPath(nextPath, fallback = "/profile") {
  if (typeof nextPath !== "string" || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}

export function buildProfileNextHref(nextPath) {
  return `/profile?next=${encodeURIComponent(normalizeNextPath(nextPath))}`;
}
