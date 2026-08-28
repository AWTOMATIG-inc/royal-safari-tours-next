"use client";

/**
 * RevealGroup Component (Disabled Animations for Max Performance)
 * Renders immediate native markup without scroll-reveal lags or viewport observers.
 */
export default function RevealGroup({
  children,
  staggerDelay,
  delay,
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

RevealGroup.Item = function RevealGroupItem({
  children,
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
};
