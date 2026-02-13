export type EquipmentStatus =
  | 'active'
  | 'defective'
  | 'wait_decom'
  | 'decommission'
  | 'active_ready_to_sell'
  | 'missing'
  | 'plan_to_replace'

export const EQUIPMENT_STATUS_CONFIG: Record<EquipmentStatus, { label: string; labelThai: string; bgColor: string; textColor: string }> = {
  active: { label: 'Active', labelThai: 'ใช้งานอยู่', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  defective: { label: 'Defective', labelThai: 'ชำรุด', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  wait_decom: { label: 'Wait Decom', labelThai: 'รอปลดระวาง', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  decommission: { label: 'Decommission', labelThai: 'ปลดระวางแล้ว', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  active_ready_to_sell: { label: 'Active-Ready to Sell', labelThai: 'พร้อมขาย', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  missing: { label: 'Missing', labelThai: 'สูญหาย', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  plan_to_replace: { label: 'Plan to Replace', labelThai: 'รอเปลี่ยนใหม่', bgColor: 'bg-purple-100', textColor: 'text-purple-700' }
}

export interface EquipmentListItem {
  id: string
  name: string
  category: string
  status: string  // Changed to string to match API response
  location: string
  lastCheck: string
  expiry: string
  isExpiring?: boolean
}

export interface EquipmentFormData {
  // Basic Info
  idCode: string;
  serialNo: string;
  assessmentId: string;

  department: string;
  brand: string;
  model: string;
  category: string;

  // Date & Price
  receiveDate: string;
  purchasePrice: number;

  equipmentAge: number;
  computeDate: string;
  lifeExpectancy: number;
  remainLife: number;
  usefulLifetimePercent: number;
  replacementYear: number;

  technology: number | null;
  usageStatistics: number | null;
  efficiency: number | null;
  others: string;
}

export interface EquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EquipmentFormData>;
}

export interface CreateEquipmentRequest {
  id_code: string;
  serial_no: string;
  assessment_id?: string;
  department: string;
  brand: string;
  model: string;
  category: string;
  receive_date: string;
  purchase_price: number;
  equipment_age: number;
  compute_date?: string;
  life_expectancy: number;
  remain_life: number;
  useful_lifetime_percent: number;
  replacement_year?: number;
  technology?: number | null;
  usage_statistics?: number | null;
  efficiency?: number | null;
  others?: string;
}

export interface EquipmentUpdateRequest {
  status?: string;
  location?: string;
  compute_date?: string;
}

export interface EquipmentResponse {
  id: number;
  id_code: string;
  serial_no: string | null;
  assessment_id: string | null;
  status: string;
  receive_date: string | null;
  purchase_price: number;
  equipment_age: number;
  compute_date: string | null;
  life_expectancy: number;
  remain_life: number;
  useful_lifetime_percent: number;
  replacement_year: number | null;
  technology: number | null;
  usage_statistics: number | null;
  efficiency: number | null;
  others: string | null;
  model: EquipmentModelDTO | null;
  department: DepartmentDTO | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentDetailResponse {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  last_check: string;
  expiry: string;
  is_expiring: boolean;
  serial_no: string;
  brand: string;
  department_id: number;
}

export interface EquipmentModelDTO {
  id: number;
  model_name: string;
  default_life_expectancy: number;
  brand: BrandDTO | null;
  category: CategoryDTO | null;
}

export interface BrandDTO {
  id: number;
  brand_name: string;
}

export interface CategoryDTO {
  id: number;
  category_name: string;
  risk_level: string;
  description: string;
}

export interface DepartmentDTO {
  id: number;
  department_name: string;
}

export interface Equipment {
  id: number;
  idCode: string;
  serialNo: string;
  assessmentId: string | null;
  modelId: number;
  departmentId: number;
  model?: EquipmentModel;
  department?: Department;
  receiveDate: string | null;
  purchasePrice: number;
  equipmentAge: number;
  computeDate: string | null;
  lifeExpectancy: number;
  remainLife: number;
  usefulLifetimePercent: number;
  replacementYear: number | null;
  technology: number | null;
  usageStatistics: number | null;
  efficiency: number | null;
  others: string | null;
  createdAt: string;
  updatedAt: string;
  maintenanceRecords?: MaintenanceRecord[];
}

export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCategory {
  id: number;
  name: string;
  ecriRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  classification: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentModel {
  id: number;
  brandId: number;
  categoryId: number;
  modelName: string;
  defaultLifeExpectancy: number;
  specifications: string;
  brand?: Brand;
  category?: EquipmentCategory;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  maintenanceType: 'CM' | 'PM';
  maintenanceDate: string;
  cost: number;
  description: string;
  technician: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceFormData {
  equipmentId: number;
  maintenanceType: 'CM' | 'PM';
  maintenanceDate: string;
  cost: number;
  description: string;
  technician: string;
}

export interface ExcelData {
  idCode: string;
  serialNo: string;
  assessmentId: string;
  department: string;
  brand: string;
  model: string;
  category: string;
  receiveDate: string;
  purchasePrice: number;
  equipmentAge: number;
  computeDate: string;
  lifeExpectancy: number;
  remainLife: number;
  usefulLifetimePercent: number;
  replacementYear: number;
  technology: number | null;
  usageStatistics: number | null;
  efficiency: number | null;
  others: string;
  ecriRisk?: string;
  classification?: string;
  totalCM?: number;
  totalCost?: number;
  perCostPrice?: number;
}

export interface ExcelUploadProps {
  onImportComplete?: () => void;
}

export interface EquipmentImportResult {
  total_rows: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  new_brands: number;
  new_categories: number;
  new_departments: number;
  new_models: number;
  failed_rows: number[];
  error_messages: string[];
}

export interface EquipmentStats {
  totalEquipment: number;
  totalCost: number;
  totalMaintenanceCost: number;
  averageAge: number;
  equipmentByRisk: {
    high: number;
    medium: number;
    low: number;
  };
  upcomingReplacements: Equipment[];
}
// types/equipment.ts

export interface ExcelData {
  // Basic Info
  idCode: string;
  serialNo: string;
  assessmentId: string;

  // Relations
  department: string;
  category: string;
  brand: string;
  model: string;

  // Date & Price
  receiveDate: string;
  purchasePrice: number;

  // Life Cycle
  lifeExpectancy: number;
  equipmentAge: number;
  computeDate: string;
  remainLife: number;
  usefulLifetimePercent: number;
  replacementYear: number;

  // Assessment Scores (0-5)
  technology: number | null;
  usageStatistics: number | null;
  efficiency: number | null;
  others: string;

  // Excel-specific fields (optional)
  ecriRisk?: string;
  classification?: string;
  totalCM?: number;
  totalCost?: number;
  perCostPrice?: number;
}

export interface ExcelUploadProps {
  onImportComplete?: () => void;
  onSubmit?: (data: EquipmentFormData) => void;
  onCancel?: () => void;
}

export interface EquipmentFormData {
  idCode: string;
  serialNo: string;
  assessmentId: string;
  department: string;
  category: string;
  brand: string;
  model: string;
  receiveDate: string;
  purchasePrice: number;
  lifeExpectancy: number;
  equipmentAge: number;
  computeDate: string;
  remainLife: number;
  usefulLifetimePercent: number;
  replacementYear: number;
}

export interface ImportResultData {
  total_rows: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  new_brands?: number;
  new_categories?: number;
  new_departments?: number;
  new_models?: number;
  error_messages?: string[];
}

export interface ImportResponse {
  success: boolean;
  data?: ImportResultData;
  message?: string;
}