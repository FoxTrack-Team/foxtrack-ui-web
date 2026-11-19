/**
 * Compares two semantic version strings (e.g. "1.1.0" and "1.0.3", with or without leading "v").
 * Returns:
 *   1 if a > b (a is newer)
 *  -1 if a < b (b is newer)
 *   0 if equal
 */
export function compareVersions(a: string, b: string): number {
  const cleanA = a.replace(/^v/i, "").trim();
  const cleanB = b.replace(/^v/i, "").trim();

  const [coreA] = cleanA.split("-");
  const [coreB] = cleanB.split("-");

  const partsA = coreA.split(".").map((n) => parseInt(n, 10) || 0);
  const partsB = coreB.split(".").map((n) => parseInt(n, 10) || 0);

  const maxLength = Math.max(partsA.length, partsB.length, 3);

  for (let i = 0; i < maxLength; i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }

  return 0;
}

export function isNewerVersion(latest: string, current: string): boolean {
  return compareVersions(latest, current) > 0;
}
