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
    remain_life: item.remain_life
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
    receive_date: formData.receiveDate,
    purchase_price: formData.purchasePrice,
    equipment_age: formData.equipmentAge,
    life_expectancy: formData.lifeExpectancy,
    remain_life: formData.remainLife,
    useful_lifetime_percent: formData.usefulLifetimePercent,
  };

  // Optional fields
  if (formData.assessmentId) request.assessment_id = formData.assessmentId;
  if (formData.computeDate) request.compute_date = formData.computeDate;
  if (formData.replacementYear && formData.replacementYear > 0) request.replacement_year = formData.replacementYear;
  if (formData.technology !== null && formData.technology !== undefined) request.technology = formData.technology;
  if (formData.usageStatistics !== null && formData.usageStatistics !== undefined) request.usage_statistics = formData.usageStatistics;
  if (formData.efficiency !== null && formData.efficiency !== undefined) request.efficiency = formData.efficiency;
  if (formData.others) request.others = formData.others;

  return request;
}

export function mapResponseToFormData(
  response: EquipmentResponse
): EquipmentFormData {
  return {
    idCode: response.id_code,
    serialNo: response.serial_no || '',
    assessmentId: response.assessment_id || '',
    department: response.department?.department_name || '',
    brand: response.model?.brand?.brand_name || '',
    model: response.model?.model_name || '',
    category: response.model?.category?.category_name || '',
    receiveDate: response.receive_date ? response.receive_date.split('T')[0] : '',
    purchasePrice: response.purchase_price || 0,
    equipmentAge: response.equipment_age || 0,
    computeDate: response.compute_date ? response.compute_date.split('T')[0] : '',
    lifeExpectancy: response.life_expectancy || 10,
    remainLife: response.remain_life || 0,
    usefulLifetimePercent: response.useful_lifetime_percent || 0,
    replacementYear: response.replacement_year || 0,
    technology: response.technology,
    usageStatistics: response.usage_statistics,
    efficiency: response.efficiency,
    others: response.others || '',
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

  const response = await api.get<ApiResponse<EquipmentListResponse>>(`/api/equipment?${queryParams.toString()}`)

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