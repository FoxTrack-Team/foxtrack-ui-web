import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

describe("Service Worker & PWA Offline Verification", () => {
  it("verifies manifest.json is present, valid JSON, and contains required PWA fields", () => {
    const manifestPath = path.resolve(import.meta.dirname, "../../../public/manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifestContent.name).toBe("FoxTrack");
    expect(manifestContent.short_name).toBe("FoxTrack");
    expect(manifestContent.start_url).toBe("/");
    expect(manifestContent.display).toBe("standalone");
    expect(manifestContent.theme_color).toBe("#f97316");
    expect(manifestContent.icons.length).toBeGreaterThanOrEqual(2);
  });

  it("verifies generated PWA icons exist and are valid PNG files", () => {
    const icon192 = path.resolve(import.meta.dirname, "../../../public/icons/icon-192x192.png");
    const icon512 = path.resolve(import.meta.dirname, "../../../public/icons/icon-512x512.png");

    expect(fs.existsSync(icon192)).toBe(true);
    expect(fs.existsSync(icon512)).toBe(true);

    // PNG signature check: \x89PNG\r\n\x1a\n
    const buf192 = fs.readFileSync(icon192);
    expect(buf192[0]).toBe(0x89);
    expect(buf192[1]).toBe(0x50); // 'P'
    expect(buf192[2]).toBe(0x4e); // 'N'
    expect(buf192[3]).toBe(0x47); // 'G'
  });

  it("verifies sw.js exists, caches app shell, and provides offline navigation fallback", () => {
    const swPath = path.resolve(import.meta.dirname, "../../../public/sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const swCode = fs.readFileSync(swPath, "utf-8");

    // Must define pre-cache assets including index.html and manifest
    expect(swCode).toContain("/index.html");
    expect(swCode).toContain("/manifest.json");

    // Must handle install and skipWaiting
    expect(swCode).toContain("install");
    expect(swCode).toContain("skipWaiting");

    // Must handle activate and clients.claim
    expect(swCode).toContain("activate");
    expect(swCode).toContain("clients.claim");

    // Must handle fetch with offline fallback for navigation
    expect(swCode).toContain("fetch");
    expect(swCode).toContain('request.mode === "navigate"');
    expect(swCode).toContain('caches.match("/index.html")');
  });
});
