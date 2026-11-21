import { describe, expect, it } from "vitest";

import { DEFAULT_LANGUAGE, getDictionary, getDirection, SUPPORTED_LANGUAGES } from "../index";

describe("i18n system", () => {
  it("includes English and Persian supported languages", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("fa");
    expect(DEFAULT_LANGUAGE).toBe("en");
  });

  it("returns correct direction for languages", () => {
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("fa")).toBe("rtl");
  });

  it("provides matching key structure in en and fa dictionaries", () => {
    const en = getDictionary("en");
    const fa = getDictionary("fa");

    function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
      let keys: string[] = [];
      for (const k of Object.keys(obj)) {
        const full = prefix ? `${prefix}.${k}` : k;
        const val = obj[k];
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          keys = keys.concat(getAllKeys(val as Record<string, unknown>, full));
        } else {
          keys.push(full);
        }
      }
      return keys;
    }

    const enKeys = getAllKeys(en as unknown as Record<string, unknown>).sort();
    const faKeys = getAllKeys(fa as unknown as Record<string, unknown>).sort();

    expect(enKeys).toEqual(faKeys);

    expect(en.common.save).toBe("Save");
    expect(fa.common.save).toBe("ذخیره");

    expect(en.settings.appearance.theme).toBe("Theme");
    expect(fa.settings.appearance.theme).toBe("تم");

    expect(en.update.dialogTitle).toBe("Update Available");
    expect(fa.update.dialogTitle).toBe("نسخه جدید در دسترس است");
  });
});
