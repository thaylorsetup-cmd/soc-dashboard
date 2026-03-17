"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LiveDot from "@/components/ui/LiveDot";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-100">{title}</h2>
        {subtitle && <p className="text-sm text-soc-neutral mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <LiveDot ok={true} size="sm" />
          <span className="text-xs font-medium text-soc-success">Live</span>
        </div>
        <time className="text-sm text-soc-neutral tabular-nums">
          {format(now, "dd MMM yyyy HH:mm:ss", { locale: ptBR })}
        </time>
      </div>
    </header>
  );
}
