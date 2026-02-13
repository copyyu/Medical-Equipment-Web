import type {
    TicketListItem,
    TicketDetail,
    TicketStats,
    TicketStatus,
    TicketPriority
} from '../types/ticket';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface TicketListResponse {
    data: TicketItemApiResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface TicketItemApiResponse {
    id: number;
    ticket_no: string;
    description?: string;
    category_id?: number;
    category_name: string;
    priority: string;
    priority_text: string;

    status: string;
    status_text: string;

    equipment_name?: string;
    equipment_id_code?: string;
    reporter_name: string;
    reporter_photo_url?: string;
    department_name?: string;
    reported_at: string;
    completed_at?: string;
    created_at: string;
}

function mapApiItemToFrontend(item: TicketItemApiResponse): TicketListItem {
    return {
        id: item.id,
        ticketNo: item.ticket_no,
        description: item.description,
        categoryId: item.category_id,
        categoryName: item.category_name,
        priority: mapApiPriorityToFrontend(item.priority),
        priorityText: item.priority_text,

        status: mapApiStatusToFrontend(item.status),
        statusText: item.status_text,

        equipmentName: item.equipment_name,
        equipmentIdCode: item.equipment_id_code,
        reporterName: item.reporter_name,
        reporterPhotoUrl: item.reporter_photo_url,
        departmentName: item.department_name,
        reportedAt: item.reported_at,
        completedAt: item.completed_at,
        createdAt: item.created_at
    };
}

export interface TicketDetailApiResponse {
    id: number;
    ticket_no: string;
    description?: string;
    category_id: number;
    category_name: string;
    priority: string;
    priority_text: string;

    status: string;
    status_text: string;

    equipment_id?: number;
    equipment_name?: string;
    equipment_id_code?: string;
    location?: string;
    reporter_name: string;
    reporter_line_id?: string;
    reporter_photo_url?: string;
    department_id?: number;
    department_name?: string;
    contact_info?: string;
    reported_at: string;
    started_at?: string;
    completed_at?: string;
    duration_hours?: number;
    created_at: string;
    updated_at: string;
    comments: Array<{
        id: number;
        content: string;
        admin_name?: string;
        is_system: boolean;
        created_at: string;
    }>;
    histories: Array<{
        id: number;
        action: string;
        field?: string;
        old_value?: string;
        new_value?: string;
        note?: string;
        admin_name?: string;
        is_system: boolean;
        created_at: string;
    }>;
}

export interface TicketStatsApiResponse {
    total: number;
    in_progress: number;
    completed: number;
    send_to_outsource: number;
}

export interface TicketListParams {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
    sort_by?: string;
    sort_dir?: string;
}

function mapApiStatusToFrontend(status: string): TicketStatus {
    const statusMap: Record<string, TicketStatus> = {
        'in_progress': 'in_progress',
        'return_equipment_back': 'return_equipment_back',
        'send_to_outsource': 'send_to_outsource'
    };
    return statusMap[status] || 'in_progress';
}

function mapApiPriorityToFrontend(priority: string): TicketPriority {
    const priorityMap: Record<string, TicketPriority> = {
        'low': 'low',
        'medium': 'medium',
        'high': 'high',
        'urgent': 'urgent'
    };
    return priorityMap[priority] || 'medium';
}

function mapApiDetailToFrontend(item: TicketDetailApiResponse): TicketDetail {
    return {
        id: item.id,
        ticketNo: item.ticket_no,
        description: item.description,
        categoryId: item.category_id,
        categoryName: item.category_name,
        priority: mapApiPriorityToFrontend(item.priority),
        priorityText: item.priority_text,

        status: mapApiStatusToFrontend(item.status),
        statusText: item.status_text,

        equipmentId: item.equipment_id,
        equipmentName: item.equipment_name,
        equipmentIdCode: item.equipment_id_code,
        location: item.location,
        reporterName: item.reporter_name,
        reporterLineId: item.reporter_line_id,
        reporterPhotoUrl: item.reporter_photo_url,
        departmentId: item.department_id,
        departmentName: item.department_name,
        contactInfo: item.contact_info,
        reportedAt: item.reported_at,
        startedAt: item.started_at,
        completedAt: item.completed_at,
        durationHours: item.duration_hours,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        comments: item.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            adminName: comment.admin_name,
            isSystem: comment.is_system,
            createdAt: comment.created_at
        })),
        histories: item.histories.map(history => ({
            id: history.id,
            action: history.action,
            field: history.field,
            oldValue: history.old_value,
            newValue: history.new_value,
            note: history.note,
            adminName: history.admin_name,
            isSystem: history.is_system,
            createdAt: history.created_at
        }))
    };
}


/**
 * Fetch paginated ticket list
 * GET /api/tickets
 */
export async function fetchTicketList(params: TicketListParams = {}): Promise<{
    data: TicketListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_dir) queryParams.append('sort_dir', params.sort_dir);

    const url = `${BASE_URL}/api/tickets?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<TicketListResponse> = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Failed to fetch ticket list');
    }

    return {
        data: result.data.data.map(mapApiItemToFrontend),
        total: result.data.pagination.total,
        page: result.data.pagination.page,
        limit: result.data.pagination.limit,
        totalPages: result.data.pagination.total_pages
    };
}

/**
 * Get ticket detail by ID
 * GET /api/tickets/:id
 */
export async function getTicketById(id: string | number): Promise<TicketDetail> {
    const url = `${BASE_URL}/api/tickets/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<TicketDetailApiResponse> = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Failed to get ticket');
    }

    return mapApiDetailToFrontend(result.data);
}

/**
 * Get ticket statistics
 * GET /api/tickets/stats
 */
export async function fetchTicketStats(): Promise<TicketStats> {
    const url = `${BASE_URL}/api/tickets/stats`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<TicketStatsApiResponse> = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Failed to fetch ticket stats');
    }

    return {
        total: result.data.total,
        inProgress: result.data.in_progress,
        completed: result.data.completed,
        sendToOutsource: result.data.send_to_outsource
    };
}

/**
 * Update ticket details
 * PUT /api/tickets/:id
 */
export async function updateTicket(
    id: string | number,
    data: {
        category_id?: number;
        status?: string;
        priority?: string;
        description?: string;
        note?: string;
    }
): Promise<void> {
    const url = `${BASE_URL}/api/tickets/${id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<null> = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Failed to update ticket');
    }
}

