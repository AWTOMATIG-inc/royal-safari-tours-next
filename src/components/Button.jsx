import React from "react";

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
    ...rest
  },
  ref
) {
  const baseStyles =
    "font-semibold rounded-[10px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-inter text-sm disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-secondary text-white shadow-sm hover:shadow",
    secondary: "bg-accent hover:bg-accent/90 text-white shadow-sm",
    outline: "border border-primary/20 hover:bg-primary/5 text-primary",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      ref={ref}
      disabled={loading || disabled}
      className={`${baseStyles} ${selectedVariant} px-6 py-3.5 ${className}`}
      {...rest}
    >
      {loading ? (
        <span>{loadingText || "Loading..."}</span>
      ) : (
        <>
          <span>{children || name}</span>
          {IconComponent && IconComponent}
        </>
      )}
    </button>
  );
});

export default Button;
