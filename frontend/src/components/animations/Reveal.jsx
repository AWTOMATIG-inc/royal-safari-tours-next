"use client";

/**
 * Reveal Component (Disabled Animations for Max Performance)
 * Renders immediate native markup without scroll-reveal lags or viewport observers.
 */
export default function Reveal({
  children,
  variant,
  delay,
  duration,
  threshold,
  once,
  margin,
  className = "",
  as = "div",
  ...props
}) {
  const Component = as;
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}
