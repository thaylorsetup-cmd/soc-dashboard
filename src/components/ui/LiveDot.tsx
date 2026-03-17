"use client";

import { clsx } from "clsx";

interface LiveDotProps {
  ok?: boolean;
  size?: "sm" | "md";
}

export default function LiveDot({ ok = true, size = "sm" }: LiveDotProps) {
  const sizeClass = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  return (
    <span className="relative inline-flex">
      <span
        className={clsx(
          sizeClass,
          "rounded-full",
          ok ? "bg-soc-success" : "bg-soc-danger"
        )}
      />
      <span
        className={clsx(
          sizeClass,
          "absolute rounded-full animate-ping opacity-75",
          ok ? "bg-soc-success" : "bg-soc-danger"
        )}
      />
    </span>
  );
}
