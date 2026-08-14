"use client";
import { trackPageView } from "@/lib/gtm";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GTMPageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
