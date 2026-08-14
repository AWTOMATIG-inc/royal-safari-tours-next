"use client"
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
export default function ScrollButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  if (isVisible) {
    return (
      <button
        onClick={scrollToTop}
        className="fixed bg-primary bottom-10 right-5 text-white z-99 p-2 rounded-full cursor-pointer hover:bg-accent"
      >
        <Icon icon="stash:arrow-up" width="25" height="25" />
      </button>
    );
  }
  return null;
}
