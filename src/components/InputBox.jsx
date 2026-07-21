import React from "react";

const InputBox = React.forwardRef(function InputBox(
  { label, icon: IconComponent, className = "", error, type = "text", id, ...rest },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col relative w-full">
      {label && (
        <label htmlFor={inputId} className="font-semibold text-xs text-[#0D231E]/70 uppercase tracking-wider mb-1.5 font-inter">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {IconComponent && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
            {IconComponent}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          {...rest}
          className={`w-full bg-white border ${
            error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#0D231E]/40"
          } rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none transition-all duration-300 font-inter ${
            IconComponent ? "pl-11 pr-4" : "px-4"
          } py-3 ${className}`}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1 font-inter">
          {typeof error === "string" ? error : error?.message}
        </span>
      )}
    </div>
  );
});

export default InputBox;
