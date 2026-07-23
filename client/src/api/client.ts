// cypod-telemetry
import { toast } from "sonner";
import { API_BASE_URL, STORAGE_KEYS } from "@/lib/config";
import type { ApiError } from "@/types";

interface DefaultResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const API_PREFIX = "/api/v1";

export class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  private getLocale(): string {
    return localStorage.getItem(STORAGE_KEYS.LOCALE) || "en";
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept-Language": this.getLocale(),
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: ApiError;
      try {
        const body: DefaultResponse<never> = await response.json();
        errorData = {
          error: body.error || "UnknownError",
          message: body.message || `HTTP ${response.status}`,
          statusCode: response.status,
        };
      } catch {
        errorData = {
          error: "UnknownError",
          message: `HTTP ${response.status}`,
          statusCode: response.status,
        };
      }

      if (response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
      }

      toast.error(errorData.message);
      throw errorData;
    }

    if (response.status === 204) return undefined as T;

    const body: DefaultResponse<T> = await response.json();
    return body.data as T;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const api = new ApiClient();
