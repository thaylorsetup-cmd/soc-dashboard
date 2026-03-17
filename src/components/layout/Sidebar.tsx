"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Shield,
  Server,
  Truck,
  FileText,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import LiveDot from "@/components/ui/LiveDot";
import { useHealth } from "@/hooks/useHealth";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/security", label: "Security", icon: Shield },
  { href: "/system", label: "System", icon: Server },
  { href: "/operations", label: "Operations", icon: Truck },
  { href: "/audit", label: "Audit Trail", icon: FileText },
  { href: "/guardian", label: "Alerts", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: health } = useHealth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const nav = (
    <>
      <div className="p-4 border-b border-soc-border">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-soc-info" />
          <div>
            <h1 className="text-sm font-bold text-gray-100">SOC Dashboard</h1>
            <p className="text-[10px] text-soc-neutral">BBT Connect</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-soc-info/10 text-soc-info border-l-2 border-soc-info"
                : "text-soc-neutral hover:bg-soc-card-hover hover:text-gray-200"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-soc-border">
        <div className="flex items-center gap-2">
          <LiveDot ok={health?.all_ok ?? true} />
          <span className="text-xs text-soc-neutral">
            {health?.all_ok
              ? "Todos os sistemas OK"
              : `${Object.values(health?.checks ?? {}).filter((c) => !c.ok).length} problema(s)`}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-soc-card p-2 text-gray-300 lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-soc-bg border-r border-soc-border transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {nav}
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 bg-soc-bg border-r border-soc-border">
        {nav}
      </aside>
    </>
  );
}
