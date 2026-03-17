import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-soc-border/30",
        className
      )}
    />
  );
}
