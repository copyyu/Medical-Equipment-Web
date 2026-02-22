import { getToken, removeToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Standard API Response
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;
        const token = getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestOptions = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized globally
            if (response.status === 401) {
                removeToken();
                window.location.href = '/';
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.statusText}`);
            }

            return data as T;
        } catch (error) {
            console.error(`API Request Error [${options.method || 'GET'} ${endpoint}]:`, error);
            throw error;
        }
    }

    get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        });
    }

    put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        });
    }

    delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }

    // For file uploads (FormData)
    upload<T>(endpoint: string, formData: FormData, headers?: Record<string, string>): Promise<T> {
        const token = getToken();
        const requestHeaders: Record<string, string> = { ...headers };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        // Note: Do NOT set Content-Type for FormData, browser sets it with boundary
        return fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
            headers: requestHeaders,
        }).then(async (response) => {
            if (response.status === 401) {
                removeToken();
                window.location.href = '/';
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Upload Error: ${response.statusText}`);
            }
            return data as T;
        });
    }
}

export const api = new ApiClient();
