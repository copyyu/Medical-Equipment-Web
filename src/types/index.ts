// ===== Types Barrel Export =====
// Re-export all types from this index for cleaner imports

export * from './equipment'
// Export status types except RecentJob (which is also in dashboard)
export {
  type AssetStatus,
  type JobStatus,
  type AssetStatusInfo,
  type JobStatusInfo,
  type StatusCount,
  type RequestItem,
  requestTypeConfig,
  priorityConfig,
  statusConfig
} from './status'
export * from './dashboard'