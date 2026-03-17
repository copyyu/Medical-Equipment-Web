import { api, type ApiResponse } from './api'
import type {
  CreateEquipmentRequest,
  EquipmentFormData,
  EquipmentImportResult,
  EquipmentListItem,
  EquipmentResponse,
  EquipmentUpdateRequest
} from '../types/equipment'

// API Response Types
export interface EquipmentListResponse {
  data: EquipmentApiItem[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface EquipmentApiItem {
  id: string
  name: string
  category: string
  status: string
  location: string
  last_check: string
  expiry: string
  is_expiring: boolean
  remain_life: number
}

export interface EquipmentListParams {
  page?: number
  limit?: number
  status?: string
  search?: string
  sort_by?: string
  sort_dir?: string
  expiry_filter?: string
  category_id?: number | string
}

export interface CategoryOption {
  id: number
  name: string
}

// Map API item to frontend EquipmentListItem
function mapApiItemToFrontend(item: EquipmentApiItem): EquipmentListItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    status: item.status,
    location: item.location,
    lastCheck: item.last_check,
    expiry: item.expiry,
    isExpiring: item.is_expiring,
    remainLife: item.remain_life
  }
}

export function mapFormDataToRequest(formData: EquipmentFormData): CreateEquipmentRequest {
  const request: CreateEquipmentRequest = {
    // Required fields 
    id_code: formData.idCode,
    serial_no: formData.serialNo,
    department: formData.department,
    brand: formData.brand,
    model: formData.model,
    category: formData.category,
    status: formData.status || 'active', // Default to active if empty

    // Optional / Map other fields directly
    asset_type_name: formData.assetTypeName,
    asset_name: formData.assetName,
    asset_id: formData.assetId,
    ecri_code: formData.ecriCode,
    asset_status_internal: formData.assetStatusInternal,
    rental_status: formData.rentalStatus,
    borrow_status: formData.borrowStatus,
    building: formData.building,
    floor: formData.floor,
    room: formData.room,
    phone_no: formData.phoneNo,
    business_name: formData.businessName,
    item_no: formData.itemNo,
    sku_no: formData.skuNo,
    receive_date: formData.receiveDate,
    purchase_date: formData.purchaseDate,
    registration_date: formData.registrationDate,
    warranty_period: formData.warrantyPeriod,
    warranty_start_date: formData.warrantyStartDate,
    warranty_end_date: formData.warrantyEndDate,
    warranty_pm: formData.warrantyPm,
    warranty_cal: formData.warrantyCal,
    last_pm_date: formData.lastPmDate,
    last_cal_date: formData.lastCalDate,
    pm_period: formData.pmPeriod,
    cal_period: formData.calPeriod,
    vendor_pm: formData.vendorPm,
    vendor_cal: formData.vendorCal,
    power_consumption: formData.powerConsumption,
    supplier: formData.supplier,
    ownership: formData.ownership,
    po_no: formData.poNo,
    contract_no: formData.contractNo,
    invoice_no: formData.invoiceNo,
    document_no: formData.documentNo,
    tor_no: formData.torNo,
    manufacturing_country: formData.manufacturingCountry,
    remark: formData.remark,
    approved_by: formData.approvedBy,
    nsmart_item_code: formData.nsmartItemCode,
    updated_by: formData.updatedBy,

    // Financial/Numbers
    purchase_price: formData.purchasePrice === '' ? 0 : formData.purchasePrice,
    revenue_per_month: formData.revenuePerMonth === '' ? null : formData.revenuePerMonth,
    life_expectancy: formData.lifeExpectancy === '' ? 10 : formData.lifeExpectancy,
  };

  return request;
}

export function mapResponseToFormData(
  response: EquipmentResponse
): EquipmentFormData {
  return {
    // Basic Info
    idCode: response.id_code,
    serialNo: response.serial_no || '',
    department: response.department?.department_name || '',
    brand: response.model?.brand?.brand_name || '',
    model: response.model?.model_name || '',
    category: response.model?.category?.category_name || '',
    status: response.status || 'active',
    assetTypeName: '', // Cannot map from current EquipmentResponse type without new backend fields
    assetName: '',     // Update mapping as backend EquipmentResponse object evolves
    assetId: '',
    ecriCode: '',

    // Status & Location
    assetStatusInternal: '',
    rentalStatus: '',
    borrowStatus: '',
    building: '',
    floor: '',
    room: '',
    phoneNo: '',

    // Business & Item Info
    businessName: '',
    itemNo: '',
    skuNo: '',

    // Dates
    receiveDate: response.receive_date ? response.receive_date.split('T')[0] : '',
    purchaseDate: '',
    registrationDate: '',

    // Financial
    purchasePrice: response.purchase_price || '',
    revenuePerMonth: '',

    // Lifecycle
    lifeExpectancy: response.life_expectancy || 10,

    // Warranty
    warrantyPeriod: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    warrantyPm: '',
    warrantyCal: '',

    // PM & CM
    lastPmDate: '',
    lastCalDate: '',
    pmPeriod: '',
    calPeriod: '',
    vendorPm: '',
    vendorCal: '',

    // Specs
    powerConsumption: '',
    supplier: '',
    ownership: '',
    manufacturingCountry: '',

    // Documents
    poNo: '',
    contractNo: '',
    invoiceNo: '',
    documentNo: '',
    torNo: '',
    nsmartItemCode: '',

    // Misc
    remark: '',
    approvedBy: '',
    updatedBy: ''
  };
}

export async function fetchEquipmentList(params: EquipmentListParams = {}): Promise<{
  data: EquipmentListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.status) queryParams.append('status', params.status)
  if (params.search) queryParams.append('search', params.search)
  if (params.sort_by) queryParams.append('sort_by', params.sort_by)
  if (params.sort_dir) queryParams.append('sort_dir', params.sort_dir)
  if (params.expiry_filter) queryParams.append('expiry_filter', params.expiry_filter)
  if (params.category_id) queryParams.append('category_id', params.category_id.toString())

  const queryString = queryParams.toString()
  const url = queryString ? `/api/equipment?${queryString}` : '/api/equipment'

  const response = await api.get<ApiResponse<EquipmentListResponse>>(url)

  return {
    data: response.data.data.map(mapApiItemToFrontend),
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.total_pages
  }
}

// Update equipment by ID
export async function updateEquipment(id: string, data: EquipmentUpdateRequest): Promise<void> {
  await api.put(`/api/equipment/${id}`, data)
}

// Delete equipment by ID
export async function deleteEquipment(id: string): Promise<void> {
  await api.delete(`/api/equipment/${id}`)
}

// Get equipment detail by ID
export async function getEquipmentById(id: string): Promise<EquipmentListItem> {
  const response = await api.get<ApiResponse<EquipmentApiItem>>(`/api/equipment/${id}`)
  return mapApiItemToFrontend(response.data)
}

export async function createEquipment(
  formData: EquipmentFormData
): Promise<ApiResponse<EquipmentResponse>> {
  const requestData = mapFormDataToRequest(formData);
  return api.post<ApiResponse<EquipmentResponse>>('/api/equipment', requestData);
}

export async function importExcelFile(
  file: File
): Promise<ApiResponse<EquipmentImportResult>> {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<ApiResponse<EquipmentImportResult>>('/import', formData);
}

// Fetch equipment categories from API
export async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const response = await api.get<ApiResponse<{ id: number; name: string; ecri_risk: string; classification: string }[]>>('/api/equipment/categories')
    return response.data.map(cat => ({ id: cat.id, name: cat.name }))
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
}