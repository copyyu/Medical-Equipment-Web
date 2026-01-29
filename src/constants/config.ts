// ===== Application Configuration =====
// Centralized configuration constants

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 8,
  PAGE_SIZE_OPTIONS: [8, 16, 24, 32]
} as const

// Auto-refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000,  // 30 seconds
  EQUIPMENT_LIST: 60000  // 1 minute
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm'
} as const