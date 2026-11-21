"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function MoreTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSubpage = pathname !== "/more";

  return (
    <div
      className={isSubpage ? "animate-settings-forward" : "animate-settings-backward"}
      key={pathname}
    >
      {children}
    </div>
  );
}
