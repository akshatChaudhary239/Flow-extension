import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowOnHover?: boolean;
}

export function Card({ children, className = "", glowOnHover = false, ...props }: CardProps) {
  return (
    <div
      className={`relative group rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden transition-transform duration-300 ${glowOnHover ? "hover:-translate-y-1 hover:shadow-lg" : ""} ${className}`}
      {...props}
    >
      {glowOnHover && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
