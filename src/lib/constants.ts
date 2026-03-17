export const REFRESH = {
  FAST: 30_000,
  NORMAL: 60_000,
} as const;

export const STATUS_COLORS = {
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  neutral: "#64748b",
} as const;

export const FREIGHT_STATUS_LABELS: Record<string, string> = {
  comercial: "Comercial",
  coleta_cadastrada: "Cadastrada",
  em_contratacao: "Contratacao",
  cadastro: "Cadastro",
  gr: "GR",
  coleta_comandada: "Comandada",
  coletada: "Coletada",
  expedicao: "Expedicao",
  custom_service: "Custom Service",
  finalizada: "Finalizada",
};

export const SEVERITY_CONFIG = {
  danger: { color: "text-soc-danger", bg: "bg-soc-danger/10", border: "border-soc-danger/30", label: "Critico" },
  warning: { color: "text-soc-warning", bg: "bg-soc-warning/10", border: "border-soc-warning/30", label: "Alerta" },
  info: { color: "text-soc-info", bg: "bg-soc-info/10", border: "border-soc-info/30", label: "Info" },
} as const;

export const INTEGRITY_STATUS_CONFIG = {
  unchanged: { color: "text-soc-success", bg: "bg-soc-success/10", label: "OK" },
  modified: { color: "text-soc-warning", bg: "bg-soc-warning/10", label: "Modificado" },
  removed: { color: "text-soc-danger", bg: "bg-soc-danger/10", label: "Removido" },
  new: { color: "text-soc-info", bg: "bg-soc-info/10", label: "Novo" },
} as const;

export const HEALTH_CHECK_LABELS: Record<string, string> = {
  database: "Database",
  disk_space: "Disco",
  log_size: "Logs",
  queue_health: "Queue",
  cache: "Cache",
  ssw_integration: "SSW",
  sessions: "Sessoes",
};
