import envConfig from "../utils/env-config";

interface ApiConfig {
    baseURL: string;
    timeout?: number;
    onUnauthorized?: () => void;
}

class ApiClient {
    private baseURL: string;
    private timeout: number;
    private onUnauthorized?: () => void;


    constructor(config: ApiConfig) {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout || 10000;
        this.onUnauthorized = config.onUnauthorized;
    }

    // Method để set callback từ AuthContext
    setUnauthorizedHandler(handler: () => void) {
        this.onUnauthorized = handler;
    }

    // Request interceptor
    private async interceptRequest(url: string, options: RequestInit = {}): Promise<[string, RequestInit]> {
        // const token = localStorage.getItem('accessToken');

        const finalOptions: RequestInit = {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                //...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        return [url, finalOptions];
    }

    // Response interceptor
    private async interceptResponse(response: Response, originalUrl: string, originalOptions: RequestInit): Promise<Response> {
        // Handle token refresh for 401
        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                // Retry original request với token mới
                const [newUrl, newOptions] = await this.interceptRequest(originalUrl, originalOptions);
                return fetch(newUrl, newOptions);
            } else {
                //this.handleUnauthorized();
                const error: any = new Error('Authentication failed');
                error.status = 401;
                throw error;
            }
        }

        if (response.status === 403) {
            await fetch(`${this.baseURL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            window.location.href = '/';
            throw new Error('Forbidden access');
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;

    }

    private handleUnauthorized() {
        if (this.onUnauthorized) {
            this.onUnauthorized();
        } else {
            console.warn('No unauthorized handler set');
        }
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        return false;
    }

    // Main fetch method với interceptors
    async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const url = `${this.baseURL}${endpoint}`;
        const [finalUrl, finalOptions] = await this.interceptRequest(url, options);

        const response = await fetch(finalUrl, finalOptions);
        return this.interceptResponse(response, url, options);
    }

    // Convenience methods
    async get(endpoint: string) {
        const response = await this.fetch(endpoint);
        return response.json();
    }

    async post(endpoint: string, data: any) {
        const response = await this.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async put(endpoint: string, data: any) {
        const response = await this.fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async delete(endpoint: string) {
        const response = await this.fetch(endpoint, { method: 'DELETE' });
        return response.json();
    }
}

export const http = new ApiClient({
    baseURL: envConfig.NEXT_PUBLIC_BACKEND_URL,
    timeout: 10000,
});