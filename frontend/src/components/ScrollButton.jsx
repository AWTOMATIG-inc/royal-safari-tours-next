"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function ScrollButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const show = window.scrollY > 300;
      setIsVisible((prev) => (prev !== show ? show : prev));
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bg-primary bottom-10 right-5 text-white z-[99] p-3 rounded-full cursor-pointer hover:bg-secondary transition-colors shadow-lg transform-gpu"
      aria-label="Scroll to top"
    >
      <Icon icon="stash:arrow-up" width="22" height="22" />
    </button>
  );
}
