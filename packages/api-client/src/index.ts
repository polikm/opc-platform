/**
 * @op/api-client - API客户端入口
 *
 * 导出默认客户端实例和各业务模块API。
 */

import { defaultClient, createApiClient, request } from './client';
import type { ApiClientOptions } from './client';

// 重新导出客户端工具
export { createApiClient, request, defaultClient as apiClient };

// ============================================================
// 认证模块 API
// ============================================================

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ChangePasswordRequest,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
} from '@op/shared-types';

/** 认证相关API */
export const authApi = {
  /** 用户注册 */
  register: (data: RegisterRequest) =>
    request<LoginResponse>(defaultClient, {
      method: 'POST',
      url: '/auth/register',
      data,
    }),

  /** 用户登录 */
  login: (data: LoginRequest) =>
    request<LoginResponse>(defaultClient, {
      method: 'POST',
      url: '/auth/login',
      data,
    }),

  /** 用户登出 */
  logout: () =>
    request<void>(defaultClient, {
      method: 'POST',
      url: '/auth/logout',
    }),

  /** 刷新Token */
  refreshToken: (refreshToken: string) =>
    request<{ accessToken: string; expiresIn: number }>(defaultClient, {
      method: 'POST',
      url: '/auth/refresh',
      data: { refreshToken },
    }),

  /** 修改密码 */
  changePassword: (data: ChangePasswordRequest) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: '/auth/change-password',
      data,
    }),

  /** 忘记密码 - 发送重置邮件 */
  forgotPassword: (email: string) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    }),

  /** 重置密码 */
  resetPassword: (token: string, newPassword: string) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, newPassword },
    }),
};

// ============================================================
// 用户模块 API
// ============================================================

import type { UserProfile, UpdateProfileRequest } from '@op/shared-types';

/** 用户相关API */
export const userApi = {
  /** 获取当前登录用户信息 */
  getCurrentUser: () =>
    request<User>(defaultClient, {
      method: 'GET',
      url: '/user/me',
    }),

  /** 获取当前用户资料 */
  getProfile: () =>
    request<UserProfile>(defaultClient, {
      method: 'GET',
      url: '/user/profile',
    }),

  /** 更新用户资料 */
  updateProfile: (data: UpdateProfileRequest) =>
    request<UserProfile>(defaultClient, {
      method: 'PUT',
      url: '/user/profile',
      data,
    }),

  /** 获取指定用户资料 */
  getUserById: (userId: string) =>
    request<UserProfile>(defaultClient, {
      method: 'GET',
      url: `/user/${userId}`,
    }),

  /** 上传用户头像 */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request<{ url: string }>(defaultClient, {
      method: 'POST',
      url: '/user/avatar',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================================
// 智能体模块 API
// ============================================================

import type {
  OPCProfile,
  CreateAgentRequest,
  UpdateAgentRequest,
  Conversation,
  Message,
  SendMessageRequest,
  PaginatedResponse as PR,
} from '@op/shared-types';

/** 智能体相关API */
export const agentApi = {
  /** 获取智能体列表 */
  list: (params?: QueryParams) =>
    request<PR<OPCProfile>>(defaultClient, {
      method: 'GET',
      url: '/agents',
      params,
    }),

  /** 获取智能体详情 */
  getById: (agentId: string) =>
    request<OPCProfile>(defaultClient, {
      method: 'GET',
      url: `/agents/${agentId}`,
    }),

  /** 创建智能体 */
  create: (data: CreateAgentRequest) =>
    request<OPCProfile>(defaultClient, {
      method: 'POST',
      url: '/agents',
      data,
    }),

  /** 更新智能体 */
  update: (agentId: string, data: UpdateAgentRequest) =>
    request<OPCProfile>(defaultClient, {
      method: 'PUT',
      url: `/agents/${agentId}`,
      data,
    }),

  /** 删除智能体 */
  delete: (agentId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/agents/${agentId}`,
    }),

  /** 获取当前用户的智能体列表 */
  listMyAgents: (params?: QueryParams) =>
    request<PR<OPCProfile>>(defaultClient, {
      method: 'GET',
      url: '/agents/mine',
      params,
    }),
};

// ============================================================
// 内容模块 API（帖子、评论）
// ============================================================

import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
} from '@op/shared-types';

/** 内容相关API */
export const contentApi = {
  // -- 帖子 --
  /** 获取帖子列表 */
  listPosts: (params?: QueryParams) =>
    request<PR<Post>>(defaultClient, {
      method: 'GET',
      url: '/posts',
      params,
    }),

  /** 获取帖子详情 */
  getPostById: (postId: string) =>
    request<Post>(defaultClient, {
      method: 'GET',
      url: `/posts/${postId}`,
    }),

  /** 创建帖子 */
  createPost: (data: CreatePostRequest) =>
    request<Post>(defaultClient, {
      method: 'POST',
      url: '/posts',
      data,
    }),

  /** 更新帖子 */
  updatePost: (postId: string, data: UpdatePostRequest) =>
    request<Post>(defaultClient, {
      method: 'PUT',
      url: `/posts/${postId}`,
      data,
    }),

  /** 删除帖子 */
  deletePost: (postId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/posts/${postId}`,
    }),

  /** 点赞帖子 */
  likePost: (postId: string) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: `/posts/${postId}/like`,
    }),

  /** 取消点赞帖子 */
  unlikePost: (postId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/posts/${postId}/like`,
    }),

  /** 收藏帖子 */
  bookmarkPost: (postId: string) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: `/posts/${postId}/bookmark`,
    }),

  /** 取消收藏帖子 */
  unbookmarkPost: (postId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/posts/${postId}/bookmark`,
    }),

  // -- 评论 --
  /** 获取帖子评论列表 */
  listComments: (postId: string, params?: QueryParams) =>
    request<PR<Comment>>(defaultClient, {
      method: 'GET',
      url: `/posts/${postId}/comments`,
      params,
    }),

  /** 创建评论 */
  createComment: (data: CreateCommentRequest) =>
    request<Comment>(defaultClient, {
      method: 'POST',
      url: '/comments',
      data,
    }),

  /** 删除评论 */
  deleteComment: (commentId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/comments/${commentId}`,
    }),

  /** 点赞评论 */
  likeComment: (commentId: string) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: `/comments/${commentId}/like`,
    }),
};

// ============================================================
// 对话模块 API
// ============================================================

/** 对话相关API */
export const conversationApi = {
  /** 获取对话列表 */
  list: (params?: QueryParams) =>
    request<PR<Conversation>>(defaultClient, {
      method: 'GET',
      url: '/conversations',
      params,
    }),

  /** 获取对话详情 */
  getById: (conversationId: string) =>
    request<Conversation>(defaultClient, {
      method: 'GET',
      url: `/conversations/${conversationId}`,
    }),

  /** 创建对话 */
  create: (agentId?: string) =>
    request<Conversation>(defaultClient, {
      method: 'POST',
      url: '/conversations',
      data: { agentId },
    }),

  /** 删除对话 */
  delete: (conversationId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/conversations/${conversationId}`,
    }),

  /** 获取对话消息列表 */
  getMessages: (conversationId: string, params?: QueryParams) =>
    request<PR<Message>>(defaultClient, {
      method: 'GET',
      url: `/conversations/${conversationId}/messages`,
      params,
    }),

  /** 发送消息 */
  sendMessage: (data: SendMessageRequest) =>
    request<Message>(defaultClient, {
      method: 'POST',
      url: '/messages',
      data,
    }),

  /** 流式发送消息（SSE） */
  sendMessageStream: (data: SendMessageRequest) =>
    new EventSource(
      `${defaultClient.defaults.baseURL}/messages/stream`
    ),
};

// ============================================================
// 商城模块 API（商品、订单）
// ============================================================

import type {
  Product,
  CreateProductRequest,
  Order,
  CreateOrderRequest,
} from '@op/shared-types';

/** 商城相关API */
export const marketplaceApi = {
  // -- 商品 --
  /** 获取商品列表 */
  listProducts: (params?: QueryParams) =>
    request<PR<Product>>(defaultClient, {
      method: 'GET',
      url: '/products',
      params,
    }),

  /** 获取商品详情 */
  getProductById: (productId: string) =>
    request<Product>(defaultClient, {
      method: 'GET',
      url: `/products/${productId}`,
    }),

  /** 创建商品 */
  createProduct: (data: CreateProductRequest) =>
    request<Product>(defaultClient, {
      method: 'POST',
      url: '/products',
      data,
    }),

  /** 更新商品 */
  updateProduct: (productId: string, data: Partial<CreateProductRequest>) =>
    request<Product>(defaultClient, {
      method: 'PUT',
      url: `/products/${productId}`,
      data,
    }),

  /** 删除商品 */
  deleteProduct: (productId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/products/${productId}`,
    }),

  /** 获取我发布的商品 */
  listMyProducts: (params?: QueryParams) =>
    request<PR<Product>>(defaultClient, {
      method: 'GET',
      url: '/products/mine',
      params,
    }),

  // -- 订单 --
  /** 获取订单列表 */
  listOrders: (params?: QueryParams) =>
    request<PR<Order>>(defaultClient, {
      method: 'GET',
      url: '/orders',
      params,
    }),

  /** 获取订单详情 */
  getOrderById: (orderId: string) =>
    request<Order>(defaultClient, {
      method: 'GET',
      url: `/orders/${orderId}`,
    }),

  /** 创建订单 */
  createOrder: (data: CreateOrderRequest) =>
    request<Order>(defaultClient, {
      method: 'POST',
      url: '/orders',
      data,
    }),

  /** 取消订单 */
  cancelOrder: (orderId: string) =>
    request<Order>(defaultClient, {
      method: 'POST',
      url: `/orders/${orderId}/cancel`,
    }),

  /** 确认收货 */
  confirmOrder: (orderId: string) =>
    request<Order>(defaultClient, {
      method: 'POST',
      url: `/orders/${orderId}/confirm`,
    }),
};

// ============================================================
// 社区模块 API（圈子）
// ============================================================

import type {
  Circle,
  CreateCircleRequest,
  UpdateCircleRequest,
  CircleMember,
} from '@op/shared-types';

/** 社区相关API */
export const communityApi = {
  /** 获取圈子列表 */
  listCircles: (params?: QueryParams) =>
    request<PR<Circle>>(defaultClient, {
      method: 'GET',
      url: '/circles',
      params,
    }),

  /** 获取圈子详情 */
  getCircleById: (circleId: string) =>
    request<Circle>(defaultClient, {
      method: 'GET',
      url: `/circles/${circleId}`,
    }),

  /** 创建圈子 */
  createCircle: (data: CreateCircleRequest) =>
    request<Circle>(defaultClient, {
      method: 'POST',
      url: '/circles',
      data,
    }),

  /** 更新圈子 */
  updateCircle: (circleId: string, data: UpdateCircleRequest) =>
    request<Circle>(defaultClient, {
      method: 'PUT',
      url: `/circles/${circleId}`,
      data,
    }),

  /** 删除圈子 */
  deleteCircle: (circleId: string) =>
    request<void>(defaultClient, {
      method: 'DELETE',
      url: `/circles/${circleId}`,
    }),

  /** 加入圈子 */
  joinCircle: (circleId: string) =>
    request<CircleMember>(defaultClient, {
      method: 'POST',
      url: `/circles/${circleId}/join`,
    }),

  /** 退出圈子 */
  leaveCircle: (circleId: string) =>
    request<void>(defaultClient, {
      method: 'POST',
      url: `/circles/${circleId}/leave`,
    }),

  /** 获取圈子成员列表 */
  listCircleMembers: (circleId: string, params?: QueryParams) =>
    request<PR<CircleMember>>(defaultClient, {
      method: 'GET',
      url: `/circles/${circleId}/members`,
      params,
    }),

  /** 获取我加入的圈子列表 */
  listMyCircles: (params?: QueryParams) =>
    request<PR<Circle>>(defaultClient, {
      method: 'GET',
      url: '/circles/mine',
      params,
    }),
};
