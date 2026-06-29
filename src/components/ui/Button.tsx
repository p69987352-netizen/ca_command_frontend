import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saas-primary disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-saas-primary text-white hover:bg-saas-secondary shadow-sm",
    secondary: "bg-saas-bgSecondary text-saas-text hover:bg-white/10",
    outline: "border border-white/10 bg-transparent hover:bg-white/5 text-saas-text",
    ghost: "bg-transparent hover:bg-white/5 text-saas-text",
    danger: "bg-saas-danger/10 text-saas-danger hover:bg-saas-danger/20"
  };

  const sizes = {
    sm: "h-9 px-3 rounded-[12px] text-xs",
    md: "h-11 px-6 rounded-[12px] text-sm",
    lg: "h-14 px-8 rounded-[12px] text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
