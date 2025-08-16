import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  center?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className,
  size = "lg",
  center = true
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-2xl", 
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "w-full px-4 sm:px-6 lg:px-8",
      sizeClasses[size],
      center && "mx-auto",
      className
    )}>
      {children}
    </div>
  );
}

export function PageContainer({ 
  children, 
  className,
  title,
  description
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <ResponsiveContainer className={cn("py-8 lg:py-12", className)}>
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </ResponsiveContainer>
  );
}

export function Section({ 
  children, 
  className,
  title,
  description,
  id
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-12 lg:py-16", className)}>
      <ResponsiveContainer>
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </ResponsiveContainer>
    </section>
  );
}
