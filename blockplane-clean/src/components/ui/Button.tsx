import React, { forwardRef } from "react";

/** tiny class combiner */
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "border border-transparent bg-black text-white hover:bg-black/90 " +
    "dark:bg-white dark:text-black dark:hover:bg-white/90",
  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 " +
    "dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/5",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-50 " +
    "dark:text-gray-300 dark:hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1",
  md: "px-3 py-1.5",
  lg: "px-4 py-2 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : (
          iconLeft
        )}
        <span>{children}</span>
        {!loading && iconRight}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
