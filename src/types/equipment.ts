// Re-export AssetStatus as EquipmentStatus for backward compatibility
export type { AssetStatus as EquipmentStatus } from './status'



export interface EquipmentListItem {
  id: string
  name: string
  category: string
  status: string  // Changed to string to match API response
  location: string
  lastCheck: string
  expiry: string
  isExpiring?: boolean
  remainLife?: number
}





export interface CreateEquipmentRequest {
  id_code: string;
  serial_no: string;
  status: string;

  // Extra Info
  asset_type_name?: string;
  asset_name?: string;
  asset_id?: string;
  ecri_code?: string;

  // Status & Location
  asset_status_internal?: string;
  rental_status?: string;
  borrow_status?: string;
  building?: string;
  floor?: string;
  room?: string;
  phone_no?: string;

  // Business & Item Info
  business_name?: string;
  item_no?: string;
  sku_no?: string;

  department: string;
  brand: string;
  model: string;
  category: string;
  receive_date: string;
  purchase_date?: string;
  registration_date?: string;
  purchase_price: number;
  revenue_per_month?: number | null;
  life_expectancy: number;

  // Warranty
  warranty_period?: string;
  warranty_start_date?: string;
  warranty_end_date?: string;
  warranty_pm?: string;
  warranty_cal?: string;

  // PM & CM
  last_pm_date?: string;
  last_cal_date?: string;
  pm_period?: string;
  cal_period?: string;
  vendor_pm?: string;
  vendor_cal?: string;

  // Specs
  power_consumption?: string;
  supplier?: string;
  ownership?: string;
  manufacturing_country?: string;

  // Documents
  po_no?: string;
  contract_no?: string;
  invoice_no?: string;
  document_no?: string;
  tor_no?: string;
  nsmart_item_code?: string;

  // Misc
  remark?: string;
  approved_by?: string;
  updated_by?: string;
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

export type ExcelData = EquipmentFormData;

export interface EquipmentFormData {
  // Basic Info
  idCode: string;
  serialNo: string;
  department: string;
  brand: string;
  model: string;
  category: string;
  status: string;
  assetTypeName: string;
  assetName: string;
  assetId: string;
  ecriCode: string;

  // Status & Location
  assetStatusInternal: string;
  rentalStatus: string;
  borrowStatus: string;
  building: string;
  floor: string;
  room: string;
  phoneNo: string;

  // Business & Item Info
  businessName: string;
  itemNo: string;
  skuNo: string;

  // Dates
  receiveDate: string;
  purchaseDate: string;
  registrationDate: string;

  // Financial
  purchasePrice: number | '';
  revenuePerMonth: number | '';

  // Lifecycle
  lifeExpectancy: number | '';

  // Warranty
  warrantyPeriod: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPm: string;
  warrantyCal: string;

  // PM & CAL
  lastPmDate: string;
  lastCalDate: string;
  pmPeriod: string;
  calPeriod: string;
  vendorPm: string;
  vendorCal: string;

  // Specs & Ownership
  powerConsumption: string;
  supplier: string;
  ownership: string;
  manufacturingCountry: string;

  // Documents
  poNo: string;
  contractNo: string;
  invoiceNo: string;
  documentNo: string;
  torNo: string;
  nsmartItemCode: string;

  // Misc
  remark: string;
  approvedBy: string;
  updatedBy: string;
}

export interface ExcelUploadProps {
  onImportComplete?: () => void;
  onSubmit?: (data: EquipmentFormData) => void;
  onCancel?: () => void;
}



export interface EquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EquipmentFormData>;
}

export interface EquipmentUpdateRequest {
  status?: string;
  location?: string;
  compute_date?: string;
  expiry_date?: string; // วันหมดอายุ - Backend จะคำนวณ remain_life ใหม่
}

export interface EquipmentImportResult {
  total_rows: number;
  success_count: number;
  updated_count: number;
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
  data?: EquipmentImportResult;
  message?: string;
}