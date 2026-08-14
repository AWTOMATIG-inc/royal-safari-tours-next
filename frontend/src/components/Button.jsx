import React from "react";
import Link from "next/link";

const Button = React.forwardRef(function Button(
  {
    className = "",
    name,
    children,
    variant = "primary",
    loading = false,
    loadingText,
    icon: IconComponent,
    disabled,
    href,
    target,
    rel,
    ...rest
  },
  ref
) {
  const baseStyles =
    "font-body font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed px-7 py-4";

  const variants = {
    primary: "bg-primary hover:bg-secondary text-white shadow-xs hover:shadow-md",
    secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-xs",
    accent: "bg-accent hover:bg-accent/90 text-white shadow-xs hover:shadow-md",
    whatsapp: "bg-whatsapp hover:bg-emerald-600 text-white shadow-xs hover:shadow-md",
    outline: "border border-primary/20 hover:bg-primary/5 text-primary bg-white/80 backdrop-blur-xs shadow-xs",
    ghost: "text-primary hover:bg-primary/5",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
  };

  const selectedVariant = variants[variant] || variants.primary;
  const combinedClasses = `${baseStyles} ${selectedVariant} ${className}`;

  const content = loading ? (
    <span>{loadingText || "Loading..."}</span>
  ) : (
    <>
      <span>{children || name}</span>
      {IconComponent && IconComponent}
    </>
  );

  if (href) {
    return (
      <Link href={href} ref={ref} target={target} rel={rel} className={combinedClasses} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      disabled={loading || disabled}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
});

export default Button;


