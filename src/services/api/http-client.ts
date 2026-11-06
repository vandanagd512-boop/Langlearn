import { env } from '@/config/env.config';
import { logger } from '../logging/logger.service';

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const isAbsolute = path.startsWith('http://') || path.startsWith('https://');
    const base = isAbsolute ? path : `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    
    if (!params) return base;

    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }

  public async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = 15000, headers = {}, ...rest } = config;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(headers as Record<string, string>),
    };

    const token = window.localStorage.getItem('langlearn_token');
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      logger.debug('HttpClient', `Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, {
        ...rest,
        headers: authHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        logger.error('HttpClient', `Response Error: ${response.status} ${url}`, errorBody);
        throw new Error(errorBody.message || `Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as T;
      return data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        logger.error('HttpClient', `Timeout after ${timeout}ms: ${url}`);
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      throw err;
    }
  }

  public get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'GET' });
  }

  public post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
