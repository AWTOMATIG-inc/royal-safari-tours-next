"use client";

import Reveal from "@/components/animations/Reveal";

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
    <div className={`space-y-3 sm:space-y-4 max-w-3xl ${alignClass} ${className}`}>
      {subtitle && (
        <Reveal variant="fadeUp" delay={0}>
          <span
            className={`inline-flex font-accent items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-accent ${
              isCentered ? "justify-center" : ""
            } ${subtitleClassName}`}
          >
            {subtitle}
          </span>
        </Reveal>
      )}
      {title && (
        <Reveal variant="fadeUp" delay={0.08}>
          <HeadingTag
            className={`font-heading ${
              level === "h1"
                ? "text-display-xl"
                : level === "h2"
                ? "text-display-lg"
                : "text-heading-xl"
            } ${dark ? "text-white" : "text-primary"} ${titleClassName}`}
          >
            {title}
          </HeadingTag>
        </Reveal>
      )}
      {description && (
        <Reveal variant="fadeUp" delay={0.16}>
          <p
            className={`text-body-md font-light max-w-xl ${
              isCentered ? "mx-auto" : ""
            } ${dark ? "text-white/80" : "text-primary/75"} ${descriptionClassName}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}


