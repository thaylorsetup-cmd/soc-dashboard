import { clsx } from "clsx";

const VARIANT_STYLES = {
  success: "bg-soc-success/15 text-soc-success border-soc-success/30",
  warning: "bg-soc-warning/15 text-soc-warning border-soc-warning/30",
  danger: "bg-soc-danger/15 text-soc-danger border-soc-danger/30",
  info: "bg-soc-info/15 text-soc-info border-soc-info/30",
  neutral: "bg-soc-neutral/15 text-soc-neutral border-soc-neutral/30",
} as const;

interface BadgeProps {
  variant: keyof typeof VARIANT_STYLES;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
