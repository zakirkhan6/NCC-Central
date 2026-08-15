import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#12355B] hover:bg-[#1E4E79] text-white focus:ring-[#12355B]/40 shadow-sm",
    secondary: "bg-white hover:bg-[#F1F5F9] text-[#12355B] border border-[#E2E8F0] focus:ring-[#12355B]/20",
    success: "bg-[#2E7D5B] hover:bg-[#256A4C] text-white focus:ring-[#2E7D5B]/40 shadow-sm",
    danger: "bg-[#C94A4A] hover:bg-[#B03E3E] text-white focus:ring-[#C94A4A]/40 shadow-sm",
    outline: "border border-[#12355B] text-[#12355B] hover:bg-[#EAF1F8] focus:ring-[#12355B]/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
