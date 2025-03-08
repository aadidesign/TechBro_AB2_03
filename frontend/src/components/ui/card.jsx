import React from 'react';

export function Card({ className, children, ...props }) {
  return (
    <div className={`bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={`text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
} 