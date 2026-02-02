import type { CreateEquipmentRequest, EquipmentFormData, EquipmentListItem, EquipmentResponse } from '../types/equipment'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

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
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface EquipmentListParams {
    page?: number
    limit?: number
    status?: string
    search?: string
    sort_by?: string
    sort_dir?: string
}

// Map API status to frontend EquipmentStatus
// Backend ส่ง Asset Status: active, defective, wait_decom, decommission, active_ready_to_sell, missing, plan_to_replace
function mapApiStatusToFrontend(status: string): EquipmentListItem['status'] {
    const statusMap: Record<string, EquipmentListItem['status']> = {
        'active': 'active',
        'defective': 'defective',
        'wait_decom': 'wait_decom',
        'decommission': 'decommission',
        'active_ready_to_sell': 'active_ready_to_sell',
        'missing': 'missing',
        'plan_to_replace': 'plan_to_replace'
    }
    return statusMap[status] || 'active'
}

// Map API item to frontend EquipmentListItem
function mapApiItemToFrontend(item: EquipmentApiItem): EquipmentListItem {
    return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: mapApiStatusToFrontend(item.status),
        location: item.location,
        lastCheck: item.last_check,
        expiry: item.expiry,
        isExpiring: item.is_expiring
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
  if (formData.assessmentId) {
    request.assessment_id = formData.assessmentId;
  }
  if (formData.computeDate) {
    request.compute_date = formData.computeDate;
  }
  if (formData.replacementYear && formData.replacementYear > 0) {
    request.replacement_year = formData.replacementYear;
  }
  if (formData.technology !== null && formData.technology !== undefined) {
    request.technology = formData.technology;
  }
  if (formData.usageStatistics !== null && formData.usageStatistics !== undefined) {
    request.usage_statistics = formData.usageStatistics;
  }
  if (formData.efficiency !== null && formData.efficiency !== undefined) {
    request.efficiency = formData.efficiency;
  }
  if (formData.others) {
    request.others = formData.others;
  }

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

    const url = `${BASE_URL}/api/equipment?${queryParams.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<EquipmentListResponse> = await response.json()

    if (!result.success) {
        throw new Error(result.message || 'Failed to fetch equipment list')
    }

    return {
        data: result.data.data.map(mapApiItemToFrontend),
        total: result.data.total,
        page: result.data.page,
        limit: result.data.limit,
        totalPages: result.data.total_pages
    }
}

// Equipment Update Request
export interface EquipmentUpdateRequest {
    status?: string
    location?: string
    compute_date?: string
}

// Update equipment by ID
export async function updateEquipment(id: string, data: EquipmentUpdateRequest): Promise<void> {
    const url = `${BASE_URL}/api/equipment/${id}`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<null> = await response.json()

    if (!result.success) {
        throw new Error(result.message || 'Failed to update equipment')
    }
}

// Delete equipment by ID
export async function deleteEquipment(id: string): Promise<void> {
    const url = `${BASE_URL}/api/equipment/${id}`
    const response = await fetch(url, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<null> = await response.json()

    if (!result.success) {
        throw new Error(result.message || 'Failed to delete equipment')
    }
}

// Get equipment detail by ID
export async function getEquipmentById(id: string): Promise<EquipmentListItem> {
    const url = `${BASE_URL}/api/equipment/${id}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<EquipmentApiItem> = await response.json()

    if (!result.success) {
        throw new Error(result.message || 'Failed to get equipment')
    }

    return mapApiItemToFrontend(result.data)
}

export async function createEquipment(
  formData: EquipmentFormData
): Promise<ApiResponse<EquipmentResponse>> {
  const requestData = mapFormDataToRequest(formData);

  const url = `${BASE_URL}/api/equipment`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: `HTTP error! status: ${response.status}` 
    }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<EquipmentResponse> = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to create equipment');
  }

  return result;
}
