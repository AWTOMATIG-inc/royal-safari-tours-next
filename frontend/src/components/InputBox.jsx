import React from "react";

const InputBox = React.forwardRef(function InputBox(
  { label, icon: IconComponent, className = "", error, type = "text", id, ...rest },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col relative w-full font-body">
      {label && (
        <label htmlFor={inputId} className="font-semibold text-xs text-primary/75 uppercase tracking-wider mb-1.5 font-body">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {IconComponent && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
            {IconComponent}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          {...rest}
          className={`w-full bg-white border ${
            error ? "border-rose-400 focus:border-rose-500" : "border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary/20"
          } rounded-xl text-sm text-primary placeholder:text-gray-400 focus:outline-none transition-all duration-300 ${
            IconComponent ? "pl-11 pr-4" : "px-4"
          } py-3 shadow-xs ${className}`}
        />
      </div>
      {error && (
        <span className="text-xs text-rose-500 mt-1 font-body">
          {typeof error === "string" ? error : error?.message}
        </span>
      )}
    </div>
  );
});

export default InputBox;

