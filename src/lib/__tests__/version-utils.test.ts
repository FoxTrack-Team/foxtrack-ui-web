import { describe, expect, it } from "vitest";

import { compareVersions, isNewerVersion } from "../version-utils";

describe("version-utils", () => {
  it("correctly identifies newer versions", () => {
    expect(isNewerVersion("1.1.0", "1.0.3")).toBe(true);
    expect(isNewerVersion("v2.0.0", "v1.9.9")).toBe(true);
    expect(isNewerVersion("1.0.4", "1.0.3")).toBe(true);
    expect(isNewerVersion("1.0.10", "1.0.9")).toBe(true);
  });

  it("correctly identifies older or equal versions", () => {
    expect(isNewerVersion("1.0.3", "1.0.3")).toBe(false);
    expect(isNewerVersion("1.0.2", "1.0.3")).toBe(false);
    expect(isNewerVersion("0.9.0", "1.0.0")).toBe(false);
  });

  it("handles leading 'v' transparently", () => {
    expect(compareVersions("v1.0.4", "1.0.3")).toBe(1);
    expect(compareVersions("1.0.4", "v1.0.4")).toBe(0);
    expect(compareVersions("v1.0.2", "1.0.3")).toBe(-1);
  });
});
