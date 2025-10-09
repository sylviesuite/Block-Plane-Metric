import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ children, className = "" }: Props) {
  return (
    <h2
      className={`mb-3 text-lg font-semibold text-gray-900 dark:text-white ${className}`}
    >
      {children}
    </h2>
  );
}
