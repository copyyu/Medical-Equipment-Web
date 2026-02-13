export type TicketStatus = 'in_progress' | 'return_equipment_back' | 'send_to_outsource';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketType = 'repair' | 'maintenance' | 'inspection' | 'other';

export const ticketStatusConfig: Record<TicketStatus, {
    label: string;
    color: string;
}> = {
    in_progress: {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    return_equipment_back: {
        label: 'Return Equipment Back',
        color: 'bg-green-100 text-green-700 border-green-300'
    },
    send_to_outsource: {
        label: 'Send to Outsource',
        color: 'bg-orange-100 text-orange-700 border-orange-300'
    }
};

export const ticketTypeConfig: Record<TicketType, {
    label: string;
    color: string;
}> = {
    repair: {
        label: 'แจ้งซ่อม',
        color: 'bg-red-100 text-red-700 border-red-300'
    },
    maintenance: {
        label: 'บำรุงรักษา',
        color: 'bg-green-100 text-green-700 border-green-300'
    },
    inspection: {
        label: 'สอบถามการใช้งาน',
        color: 'bg-purple-100 text-purple-700 border-purple-300'
    },
    other: {
        label: 'อื่นๆ',
        color: 'bg-gray-100 text-gray-700 border-gray-300'
    }
};

export const ticketPriorityConfig: Record<TicketPriority, {
    label: string;
    color: string;
}> = {
    low: {
        label: 'ต่ำ',
        color: 'bg-gray-100 text-gray-700 border-gray-300'
    },
    medium: {
        label: 'ปานกลาง',
        color: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    high: {
        label: 'สูง',
        color: 'bg-orange-100 text-orange-700 border-orange-300'
    },
    urgent: {
        label: 'เร่งด่วน',
        color: 'bg-red-100 text-red-700 border-red-300'
    }
};

export interface TicketListItem {
    id: number;
    ticketNo: string;
    description?: string;
    categoryId?: number;
    categoryName: string;
    priority: TicketPriority;
    priorityText: string;

    status: TicketStatus;
    statusText: string;

    equipmentName?: string;
    equipmentIdCode?: string;
    reporterName: string;
    reporterPhotoUrl?: string;
    departmentName?: string;
    reportedAt: string;
    completedAt?: string;
    createdAt: string;
}

// Ticket Detail
export interface TicketDetail {
    id: number;
    ticketNo: string;
    description?: string;
    categoryId: number;
    categoryName: string;
    priority: TicketPriority;
    priorityText: string;

    status: TicketStatus;
    statusText: string;

    equipmentId?: number;
    equipmentName?: string;
    equipmentIdCode?: string;
    location?: string;
    reporterName: string;
    reporterLineId?: string;
    reporterPhotoUrl?: string;
    departmentId?: number;
    departmentName?: string;
    contactInfo?: string;
    reportedAt: string;
    startedAt?: string;
    completedAt?: string;
    durationHours?: number;
    createdAt: string;
    updatedAt: string;
    comments: TicketComment[];
    histories: TicketHistory[];
}

// Ticket Comment
export interface TicketComment {
    id: number;
    content: string;
    adminName?: string;
    isSystem: boolean;
    createdAt: string;
}

// Ticket History
export interface TicketHistory {
    id: number;
    action: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
    note?: string;
    adminName?: string;
    isSystem: boolean;
    createdAt: string;
}

// Ticket Stats
export interface TicketStats {
    total: number;
    inProgress: number;
    completed: number;
    sendToOutsource: number;
}

export interface TicketCategories {
    statuses: Array<{
        value: TicketStatus;
        label: string;
    }>;
    priorities: Array<{
        value: TicketPriority;
        label: string;
    }>;
}
export interface RequestItem {
    id: string;
    requestNumber: string;
    equipmentName: string;
    equipmentSerial: string;
    requesterName: string;
    department: string;
    description: string;
    requestType: string;
    requestDate: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
}