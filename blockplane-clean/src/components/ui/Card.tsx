import React from "react";

/** simple class combiner */
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

/** Print-safe, dark-mode-aware Card primitive. */
const Card: React.FC<CardProps> = ({
  children,
  className = "",
  noPadding = false,
  ...props
}) => {
  const base =
    "rounded-2xl border bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 " +
    "print:shadow-none print:border-0 print:bg-white";
  const padding = noPadding ? "" : "p-4";
  return (
    <div className={cn(base, padding, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3", props.className)} {...props} />;
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100",
        props.className,
      )}
      {...props}
    />
  );
}

export function CardDescription(
  props: React.HTMLAttributes<HTMLParagraphElement>,
) {
  return (
    <p
      className={cn(
        "text-sm text-zinc-600 dark:text-zinc-300",
        props.className,
      )}
      {...props}
    />
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-3", props.className)} {...props} />;
}

export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-end gap-2",
        props.className,
      )}
      {...props}
    />
  );
}
