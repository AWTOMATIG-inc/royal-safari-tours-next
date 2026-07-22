"use client";

import { Icon } from "@iconify/react";

export default function SectionHeading({
  title,
  subtitle,
  description,
  level = "h2",
  align = "left",
  dark = false,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  descriptionClassName = "",
}) {
  const isCentered = align === "center";
  const alignClass = isCentered ? "text-center mx-auto" : "text-left";
  const HeadingTag = level;
  
  return (
    <div className={`space-y-3 sm:space-y-4 max-w-3xl ${alignClass} ${className} font-subheading`}>
      {subtitle && (
        <span className={`inline-flex font-mansalva items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-accent ${
          isCentered ? "justify-center" : ""
        } ${subtitleClassName}`}>
          {subtitle}
        </span>
      )}
      {title && (
        <HeadingTag className={`font-heading ${
          level === "h1" 
            ? "text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08]" 
            : "text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
        } ${
          dark ? "text-white" : "text-primary"
        } ${titleClassName}`}>
          {title}
        </HeadingTag>
      )}
      {description && (
        <p className={`text-sm sm:text-base font-light font-body max-w-xl ${
          isCentered ? "mx-auto" : ""
        } ${
          dark ? "text-white/80" : "text-primary/70"
        } ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}
