/**
 * @op/api-client - Axios实例配置
 *
 * 包含请求/响应拦截器、JWT Token自动注入、统一错误处理等。
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse, ApiError } from '@op/shared-types';

/** API客户端配置选项 */
export interface ApiClientOptions {
  /** API基础URL，默认从环境变量 VITE_API_BASE_URL 或 NEXT_PUBLIC_API_BASE_URL 读取 */
  baseURL?: string;
  /** 请求超时时间（毫秒），默认30000 */
  timeout?: number;
  /** 自定义Token获取函数 */
  getToken?: () => string | null;
  /** 自定义Token设置函数（登录后调用） */
  setToken?: (token: string) => void;
  /** 自定义Token清除函数（登出时调用） */
  clearToken?: () => void;
  /** 自定义错误处理函数 */
  onError?: (error: ApiError) => void;
  /** 自定义401未授权处理函数 */
  onUnauthorized?: () => void;
}

/** 默认配置 */
const DEFAULT_OPTIONS: Required<Omit<ApiClientOptions, 'baseURL'>> = {
  timeout: 30000,
  getToken: () => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },
  setToken: (token: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },
  clearToken: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  onError: (error) => {
    console.error('[API Error]', error.code, error.message);
  },
  onUnauthorized: () => {
    console.warn('[API] 未授权访问，请重新登录');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};

/** 解析API基础URL */
function resolveBaseURL(customBaseURL?: string): string {
  if (customBaseURL) return customBaseURL;

  // 优先级：VITE_API_BASE_URL > NEXT_PUBLIC_API_BASE_URL > 默认值
  return (
    (typeof process !== 'undefined' && process.env?.['VITE_API_BASE_URL']) ||
    (typeof process !== 'undefined' && process.env?.['NEXT_PUBLIC_API_BASE_URL']) ||
    (typeof import.meta !== 'undefined' && (import.meta as Record<string, unknown>).env?.['VITE_API_BASE_URL'] as string) ||
    '/api'
  );
}

/**
 * 创建API客户端实例
 *
 * @param options - 客户端配置选项
 * @returns 配置好的Axios实例
 */
export function createApiClient(options: ApiClientOptions = {}): AxiosInstance {
  const resolvedOptions = { ...DEFAULT_OPTIONS, ...options };
  const baseURL = resolveBaseURL(options.baseURL);

  const client = axios.create({
    baseURL,
    timeout: resolvedOptions.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ---- 请求拦截器：自动注入JWT Token ----
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = resolvedOptions.getToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // ---- 响应拦截器：统一错误处理 ----
  client.interceptors.response.use(
    (response) => {
      // 直接返回响应数据
      return response;
    },
    async (error: AxiosError<ApiResponse>) => {
      const status = error.response?.status;
      const responseData = error.response?.data;

      // 构建标准错误对象
      const apiError: ApiError = {
        code: (responseData?.error?.code as string) || `HTTP_${status || 'UNKNOWN'}`,
        message:
          (responseData?.error?.message as string) ||
          error.message ||
          '请求失败，请稍后重试',
        details: responseData?.error?.details as Record<string, unknown>,
      };

      // 调用自定义错误处理
      resolvedOptions.onError(apiError);

      // 401 未授权处理
      if (status === 401) {
        resolvedOptions.clearToken();
        resolvedOptions.onUnauthorized();
      }

      // 403 禁止访问
      if (status === 403) {
        console.error('[API] 禁止访问该资源');
      }

      // 429 请求过于频繁
      if (status === 429) {
        console.warn('[API] 请求过于频繁，请稍后再试');
      }

      // 500+ 服务器错误
      if (status && status >= 500) {
        console.error('[API] 服务器内部错误');
      }

      // 网络错误
      if (!status) {
        console.error('[API] 网络连接失败，请检查网络设置');
      }

      return Promise.reject(apiError);
    }
  );

  return client;
}

/**
 * 类型安全的请求辅助函数
 *
 * @param client - Axios实例
 * @param config - 请求配置
 * @returns 带类型的响应数据
 */
export async function request<T>(
  client: AxiosInstance,
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await client.request<ApiResponse<T>>(config);
  return response.data;
}

/**
 * 导出默认客户端实例
 * 可在应用初始化时通过 createApiClient 替换
 */
export const defaultClient = createApiClient();
