/**
 * API客户端初始化配置
 * 统一管理后端API请求的基础配置
 */

// API基础URL，从环境变量读取
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// API版本
const API_VERSION = "v1";

/**
 * 请求配置接口
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

/**
 * 通用请求函数
 */
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, ...init } = config;

  // 构建完整URL
  let url = `${API_BASE_URL}/api/${API_VERSION}${endpoint}`;

  // 添加查询参数
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // 设置默认请求头
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init.headers,
  };

  // 添加认证Token（客户端请求时）
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  // 处理错误响应
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "请求失败，请稍后重试",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // 处理204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * API客户端
 */
export const api = {
  /** GET请求 */
  get<T>(endpoint: string, params?: Record<string, string>) {
    return request<T>(endpoint, { method: "GET", params });
  },

  /** POST请求 */
  post<T>(endpoint: string, data?: unknown) {
    return request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /** PUT请求 */
  put<T>(endpoint: string, data?: unknown) {
    return request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /** PATCH请求 */
  patch<T>(endpoint: string, data?: unknown) {
    return request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /** DELETE请求 */
  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: "DELETE" });
  },
};

export default api;
