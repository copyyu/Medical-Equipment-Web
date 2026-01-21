// ===== Equipment List Item (สำหรับตารางรายการอุปกรณ์) =====
export type EquipmentStatus = 'ready' | 'in_use' | 'maintenance' | 'broken' | 'expired'

export interface EquipmentListItem {
  id: string
  name: string
  category: string
  status: EquipmentStatus
  location: string
  lastCheck: string
  expiry: string
}

export const EQUIPMENT_STATUS_CONFIG: Record<EquipmentStatus, { label: string; bgColor: string; textColor: string }> = {
  ready: { label: 'พร้อมใช้', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  in_use: { label: 'กำลังใช้งาน', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  maintenance: { label: 'อุปกรณ์ชำรุด', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  broken: { label: 'ชำรุด', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  expired: { label: 'หมดอายุ', bgColor: 'bg-red-100', textColor: 'text-red-700' }
}

// ===== Equipment Form Data (สำหรับกรอกข้อมูล) =====
export interface EquipmentFormData {
  // Basic Info
  idCode: string;                    // ID CODE
  serialNo: string;                  // Serial No
  assessmentId: string;              // Assessment ID

  // Relations (กรอกชื่อ - Backend จะแปลงเป็น ID)
  department: string;                // Department name (Backend จะ find or create)
  brand: string;                     // Brand name (Backend จะ find or create)
  model: string;                     // Model name (Backend จะ find or create)
  category: string;                  // Category name (Backend จะ find or create)

  // Date & Price
  receiveDate: string;               // Receive Date (ISO format: YYYY-MM-DD)
  purchasePrice: number;             // Purchase price

  // Life Cycle (Calculated Fields)
  equipmentAge: number;              // Equipment Age (years)
  computeDate: string;               // Compute Date (ISO format: YYYY-MM-DD)
  lifeExpectancy: number;            // Life Expect (years)
  remainLife: number;                // Remain Life (years)
  usefulLifetimePercent: number;     // % of useful lifetime
  replacementYear: number;           // Replacement Year

  // Assessment Scores
  technology: number | null;         // Technology (0-100)
  usageStatistics: number | null;    // Usage Statistics (0-100)
  efficiency: number | null;         // Efficiency (0-100)
  others: string;                    // Others (notes)
}

// ===== Equipment Form Props =====
export interface EquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EquipmentFormData>;
}

// ===== Request =====
export interface CreateEquipmentRequest {
  idCode: string;
  serialNo: string;
  assessmentId?: string;

  department: string;
  brand: string;
  model: string;
  category: string;

  receiveDate: string;
  purchasePrice: number;
  lifeExpectancy: number;
  technology?: number;
  usageStatistics?: number;
  efficiency?: number;
  others?: string;
}

// ===== Response  =====
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

// ===== Excel Import Types =====
export interface ExcelData {
  // Basic Info
  idCode: string;                    // ID CODE
  serialNo: string;                  // Serial No
  assessmentId: string;              // Assessment ID

  // Relations (กรอกชื่อ - Backend จะแปลงเป็น ID)
  department: string;                // Department name (Backend จะ find or create)
  brand: string;                     // Brand name (Backend จะ find or create)
  model: string;                     // Model name (Backend จะ find or create)
  category: string;                  // Category name (Backend จะ find or create)

  // Date & Price
  receiveDate: string;               // Receive Date (ISO format: YYYY-MM-DD)
  purchasePrice: number;             // Purchase price

  // Life Cycle (Calculated Fields)
  equipmentAge: number;              // Equipment Age (years)
  computeDate: string;               // Compute Date (ISO format: YYYY-MM-DD)
  lifeExpectancy: number;            // Life Expect (years)
  remainLife: number;                // Remain Life (years)
  usefulLifetimePercent: number;     // % of useful lifetime
  replacementYear: number;           // Replacement Year

  // Assessment Scores
  technology: number | null;         // Technology (0-100)
  usageStatistics: number | null;    // Usage Statistics (0-100)
  efficiency: number | null;         // Efficiency (0-100)
  others: string;                    // Others (notes)
}

export interface ExcelUploadProps {
  onDataImport: (data: ExcelData[]) => void;
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