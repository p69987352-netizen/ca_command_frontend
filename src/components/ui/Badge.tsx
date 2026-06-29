import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-saas-primary";
  
  const variants = {
    default: "bg-saas-bgSecondary text-saas-text",
    success: "bg-saas-success/10 text-saas-success border border-saas-success/20",
    warning: "bg-saas-warning/10 text-saas-warning border border-saas-warning/20",
    danger: "bg-saas-danger/10 text-saas-danger border border-saas-danger/20",
    outline: "text-saas-text border border-white/10"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
