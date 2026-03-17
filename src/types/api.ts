// ── Health Check ─────────────────────────────────────────
export interface HealthCheckItem {
  ok: boolean;
  detail: string;
}

export interface HealthCheckResponse {
  checks: Record<string, HealthCheckItem>;
  all_ok: boolean;
  checked_at: string;
}

// ── Daily Report ─────────────────────────────────────────
export interface SecurityMetrics {
  failed_logins: number;
  successful_logins: number;
  permission_denials: number;
  brute_force_alerts: number;
  auth_errors: number;
  exports: number;
}

export interface OperationsMetrics {
  freight_orders_created: number;
  freight_orders_finalized: number;
  freight_orders_cancelled: number;
}

export interface SystemMetrics {
  disk_free_gb: number;
  log_size_mb: number;
  last_health_check: string;
  failed_jobs: number;
  pending_jobs: number;
}

export interface DailyReportResponse {
  period: string;
  security: SecurityMetrics;
  operations: OperationsMetrics;
  system: SystemMetrics;
}

// ── Integrity Check ──────────────────────────────────────
export type IntegrityStatus = "unchanged" | "modified" | "removed" | "new";

export interface IntegrityCheckResponse {
  files: Record<string, IntegrityStatus>;
  has_changes: boolean;
  checked_at: string;
}

// ── Security Events ──────────────────────────────────────
export interface SecurityEvent {
  timestamp: string;
  level: string;
  type: string;
  message: string;
  context: Record<string, unknown>;
}

// ── Activity Log ─────────────────────────────────────────
export interface ActivityLogEntry {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  causer_name: string | null;
  event: string;
  properties: {
    old?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
  };
  batch_uuid: string | null;
  created_at: string;
  updated_at: string;
}

// ── Freight Pipeline ─────────────────────────────────────
export interface FreightPipelineResponse {
  pipeline: Record<string, number>;
  cancelled: number;
  total_active: number;
}

// ── Freight Transitions ──────────────────────────────────
export interface FreightTransition {
  id: number;
  freight_order_id: number;
  reference_code: string | null;
  user_id: number | null;
  user_name: string | null;
  from_status: string | null;
  to_status: string;
  notes: string | null;
  action_type: string;
  metadata: string | null;
  created_at: string;
}

// ── Sessions ─────────────────────────────────────────────
export interface SessionInfo {
  id: string;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: number;
  last_activity_human: string;
}

export interface SessionsResponse {
  data: SessionInfo[];
  total: number;
}

// ── Guardian Alerts ──────────────────────────────────────
export type AlertSeverity = "danger" | "warning" | "info";

export interface GuardianAlert {
  id: number;
  workflow_name: string;
  alert_type: string;
  title: string;
  severity: AlertSeverity;
  summary: string | null;
  columns: string[] | null;
  rows: unknown[][] | null;
  row_count: number;
  triggered_at: string;
  created_at: string;
}

export interface GuardianAlertsResponse {
  data: GuardianAlert[];
  meta: PaginationMeta;
  stats_30d: Record<string, number>;
}

// ── Containers ───────────────────────────────────────────
export interface ContainerStatus {
  name: string;
  status: string;
  ports: string;
  healthy: boolean;
}

export interface ContainersResponse {
  containers: ContainerStatus[];
  total: number;
  checked_at: string;
}

// ── System Disk ──────────────────────────────────────────
export interface DiskUsageResponse {
  free_bytes: number;
  total_bytes: number;
  used_bytes: number;
  free_gb: number;
  total_gb: number;
  used_percent: number;
  checked_at: string;
}

// ── System Logs ──────────────────────────────────────────
export interface LogChannelInfo {
  size_bytes: number;
  size_mb: number;
  files: number;
}

export interface SystemLogsResponse {
  logs: Record<string, LogChannelInfo>;
  checked_at: string;
}

// ── System Queue ─────────────────────────────────────────
export interface QueueMetricsResponse {
  pending: number;
  failed_total: number;
  failed_24h: number;
  oldest_pending_at: string | null;
  checked_at: string;
}

// ── Pagination ───────────────────────────────────────────
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
