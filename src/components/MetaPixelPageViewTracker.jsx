"use client";

import { trackMetaPixelPageView } from "@/lib/meta-pixel";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function MetaPixelPageViewTracker() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    trackMetaPixelPageView();
  }, [pathname]);

  return null;
}