import type { NextConfig } from "next";

import os from "node:os";

function getLocalDevOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);

  if (process.env.ALLOWED_DEV_ORIGINS) {
    for (const origin of process.env.ALLOWED_DEV_ORIGINS.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  try {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
      for (const net of iface ?? []) {
        if (net.family === "IPv4" && !net.internal) {
          origins.add(net.address);
        }
      }
    }
  } catch {
    // Fallback safely if network interfaces cannot be inspected
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: getLocalDevOrigins(),
};

export default nextConfig;
