import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
  text?: string;
}

export function Loading({ 
  size = "md", 
  variant = "spinner", 
  className,
  text 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "animate-spin rounded-full border-2 border-muted border-t-primary",
              sizeClasses[size]
            )}
          />
          {text && (
            <p className={cn("text-muted-foreground", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded-full animate-pulse",
                  size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s"
                }}
              />
            ))}
          </div>
          {text && (
            <p className={cn("text-muted-foreground", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "bg-primary rounded-full animate-pulse",
              sizeClasses[size]
            )}
          />
          {text && (
            <p className={cn("text-muted-foreground", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function PageLoading({ text = "Yuklanmoqda..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

export function SectionLoading({ text = "Yuklanmoqda..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loading size="md" text={text} />
    </div>
  );
}

export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return <Loading size={size} variant="spinner" className="mr-2" />;
}
