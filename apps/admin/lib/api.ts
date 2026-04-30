/**
 * 管理后台API客户端
 * 封装所有与后端API的交互，自动附加管理员Token
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * 获取管理员Token
 */
function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

/**
 * 通用请求方法
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // 附加管理员Token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 处理未授权
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    throw new Error('未授权，请重新登录');
  }

  // 处理错误
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || `请求失败: ${response.status}`);
  }

  return response.json();
}

// ==================== 认证相关 ====================

/** 管理员登录 */
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: AdminUser }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    request<void>('/admin/auth/logout', { method: 'POST' }),

  getProfile: () =>
    request<AdminUser>('/admin/auth/profile'),
};

// ==================== 用户管理 ====================

export const userApi = {
  /** 获取用户列表 */
  getList: (params: UserListParams) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params.search) searchParams.set('search', params.search);
    if (params.role) searchParams.set('role', params.role);
    if (params.status) searchParams.set('status', params.status);
    return request<PaginatedResponse<User>>(`/admin/users?${searchParams.toString()}`);
  },

  /** 获取用户详情 */
  getDetail: (id: string) =>
    request<UserDetail>(`/admin/users/${id}`),

  /** 更新用户信息 */
  update: (id: string, data: Partial<User>) =>
    request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 封禁用户 */
  ban: (id: string, reason: string) =>
    request<void>(`/admin/users/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  /** 解封用户 */
  unban: (id: string) =>
    request<void>(`/admin/users/${id}/unban`, { method: 'POST' }),
};

// ==================== 智能体管理 ====================

export const agentApi = {
  /** 获取智能体列表 */
  getList: (params: AgentListParams) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params.search) searchParams.set('search', params.search);
    if (params.status) searchParams.set('status', params.status);
    return request<PaginatedResponse<Agent>>(`/admin/agents?${searchParams.toString()}`);
  },

  /** 获取智能体详情 */
  getDetail: (id: string) =>
    request<AgentDetail>(`/admin/agents/${id}`),

  /** 更新智能体 */
  update: (id: string, data: Partial<Agent>) =>
    request<Agent>(`/admin/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 下架智能体 */
  takeDown: (id: string, reason: string) =>
    request<void>(`/admin/agents/${id}/take-down`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// ==================== 内容审核 ====================

export const contentApi = {
  /** 获取待审核内容列表 */
  getPendingList: (params: ContentListParams) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params.type) searchParams.set('type', params.type);
    return request<PaginatedResponse<ContentItem>>(`/admin/content/pending?${searchParams.toString()}`);
  },

  /** 审核通过 */
  approve: (id: string) =>
    request<void>(`/admin/content/${id}/approve`, { method: 'POST' }),

  /** 审核拒绝 */
  reject: (id: string, reason: string) =>
    request<void>(`/admin/content/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  /** 删除内容 */
  delete: (id: string) =>
    request<void>(`/admin/content/${id}`, { method: 'DELETE' }),

  /** 获取举报列表 */
  getReports: (params: ContentListParams) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
    return request<PaginatedResponse<ReportItem>>(`/admin/content/reports?${searchParams.toString()}`);
  },

  /** 处理举报 */
  handleReport: (id: string, action: 'dismiss' | 'warn' | 'ban', reason: string) =>
    request<void>(`/admin/content/reports/${id}`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    }),
};

// ==================== 数据分析 ====================

export const analyticsApi = {
  /** 获取概览数据 */
  getOverview: () =>
    request<DashboardOverview>('/admin/analytics/overview'),

  /** 获取用户增长趋势 */
  getUserGrowth: (params: { startDate: string; endDate: string }) => {
    const searchParams = new URLSearchParams(params);
    return request<GrowthData[]>(`/admin/analytics/user-growth?${searchParams.toString()}`);
  },

  /** 获取对话量统计 */
  getConversationStats: (params: { startDate: string; endDate: string }) => {
    const searchParams = new URLSearchParams(params);
    return request<ConversationData[]>(`/admin/analytics/conversations?${searchParams.toString()}`);
  },

  /** 获取收入统计 */
  getRevenueStats: (params: { startDate: string; endDate: string }) => {
    const searchParams = new URLSearchParams(params);
    return request<RevenueData[]>(`/admin/analytics/revenue?${searchParams.toString()}`);
  },

  /** 获取智能体使用排行 */
  getAgentRanking: (params: { startDate: string; endDate: string; limit?: number }) => {
    const searchParams = new URLSearchParams(params as Record<string, string>);
    return request<AgentRankingData[]>(`/admin/analytics/agent-ranking?${searchParams.toString()}`);
  },
};

// ==================== 系统设置 ====================

export const settingsApi = {
  /** 获取系统设置 */
  get: () =>
    request<SystemSettings>('/admin/settings'),

  /** 更新系统设置 */
  update: (data: Partial<SystemSettings>) =>
    request<SystemSettings>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 获取系统状态 */
  getStatus: () =>
    request<SystemStatus>('/admin/system/status'),
};

// ==================== 类型定义 ====================

/** 管理员用户 */
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'operator';
  lastLoginAt: string;
}

/** 普通用户 */
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'vip' | 'developer';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLoginAt?: string;
}

/** 用户详情 */
interface UserDetail extends User {
  bio?: string;
  phone?: string;
  agentCount: number;
  conversationCount: number;
  tokenUsage: number;
  balance: number;
  agents: Agent[];
  recentConversations: Conversation[];
  operationLogs: OperationLog[];
}

/** 智能体 */
interface Agent {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  creatorId: string;
  creatorName: string;
  status: 'published' | 'draft' | 'reviewing' | 'rejected' | 'taken_down';
  conversationCount: number;
  tokenUsage: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

/** 智能体详情 */
interface AgentDetail extends Agent {
  systemPrompt?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  category: string;
  tags: string[];
}

/** 对话记录 */
interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  messageCount: number;
  tokenUsage: number;
  createdAt: string;
}

/** 操作日志 */
interface OperationLog {
  id: string;
  action: string;
  detail: string;
  operatorId?: string;
  operatorName?: string;
  createdAt: string;
}

/** 内容项 */
interface ContentItem {
  id: string;
  type: 'agent' | 'conversation' | 'review' | 'comment';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reportCount?: number;
}

/** 举报项 */
interface ReportItem {
  id: string;
  targetType: 'agent' | 'conversation' | 'user';
  targetId: string;
  targetName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

/** 分页响应 */
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 仪表盘概览 */
interface DashboardOverview {
  totalUsers: number;
  totalAgents: number;
  todayConversations: number;
  todayRevenue: number;
  userGrowthRate: number;
  agentGrowthRate: number;
  conversationGrowthRate: number;
  revenueGrowthRate: number;
}

/** 增长数据 */
interface GrowthData {
  date: string;
  count: number;
  cumulative: number;
}

/** 对话量数据 */
interface ConversationData {
  date: string;
  count: number;
  uniqueUsers: number;
}

/** 收入数据 */
interface RevenueData {
  date: string;
  amount: number;
  tokenRevenue: number;
  subscriptionRevenue: number;
}

/** 智能体排行数据 */
interface AgentRankingData {
  agentId: string;
  agentName: string;
  conversationCount: number;
  tokenUsage: number;
  rating: number;
}

/** 系统设置 */
interface SystemSettings {
  platformName: string;
  platformLogo?: string;
  platformDescription?: string;
  defaultModel: string;
  tokenQuota: {
    free: number;
    vip: number;
    developer: number;
  };
  payment: {
    enabled: boolean;
    stripePublicKey?: string;
    wechatPayEnabled: boolean;
    alipayEnabled: boolean;
  };
  notification: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
}

/** 系统状态 */
interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  apiLatency: number;
  activeConnections: number;
  uptime: number;
  version: string;
}

/** 用户列表参数 */
interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

/** 智能体列表参数 */
interface AgentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

/** 内容列表参数 */
interface ContentListParams {
  page?: number;
  pageSize?: number;
  type?: string;
}
