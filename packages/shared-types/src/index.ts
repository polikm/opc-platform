/**
 * @op/shared-types - OPC平台共享类型定义
 *
 * 包含所有核心业务实体的TypeScript类型定义，
 * 用于前后端类型共享，确保数据结构一致性。
 */

// ============================================================
// 通用类型
// ============================================================

/** 唯一标识符类型 */
export type ID = string;

/** ISO 8601 时间戳字符串 */
export type Timestamp = string;

/** 分页请求参数 */
export interface PaginationParams {
  /** 页码，从1开始 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/** 分页响应结构 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
}

/** 通用API响应结构 */
export interface ApiResponse<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data: T;
  /** 提示消息 */
  message?: string;
  /** 错误信息 */
  error?: ApiError;
}

/** API错误信息 */
export interface ApiError {
  /** 错误码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 详细错误信息 */
  details?: Record<string, unknown>;
}

/** 排序方向 */
export type SortDirection = 'asc' | 'desc';

/** 排序参数 */
export interface SortParams {
  /** 排序字段 */
  sortBy: string;
  /** 排序方向 */
  sortDirection: SortDirection;
}

/** 通用查询参数 */
export interface QueryParams extends PaginationParams, Partial<SortParams> {
  /** 搜索关键词 */
  keyword?: string;
}

// ============================================================
// 用户相关类型
// ============================================================

/** 用户性别 */
export type Gender = 'male' | 'female' | 'other' | 'unknown';

/** 用户状态 */
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending_verification';

/** 用户角色 */
export type UserRole = 'user' | 'admin' | 'super_admin';

/** 用户基本信息 */
export interface User {
  /** 用户唯一ID */
  id: ID;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone?: string;
  /** 密码哈希（不返回给前端） */
  passwordHash?: string;
  /** 头像URL */
  avatar?: string;
  /** 用户状态 */
  status: UserStatus;
  /** 用户角色 */
  role: UserRole;
  /** 邮箱是否已验证 */
  emailVerified: boolean;
  /** 手机号是否已验证 */
  phoneVerified: boolean;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
  /** 最后登录时间 */
  lastLoginAt?: Timestamp;
}

/** 用户详细资料 */
export interface UserProfile {
  /** 关联用户ID */
  userId: ID;
  /** 昵称 */
  nickname: string;
  /** 个人简介 */
  bio?: string;
  /** 个人网站 */
  website?: string;
  /** 所在城市 */
  location?: string;
  /** 性别 */
  gender: Gender;
  /** 生日 */
  birthday?: Timestamp;
  /** 社交媒体链接 */
  socialLinks: SocialLinks;
  /** 自定义标签 */
  tags: string[];
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 社交媒体链接 */
export interface SocialLinks {
  /** 微信 */
  wechat?: string;
  /** 微博 */
  weibo?: string;
  /** GitHub */
  github?: string;
  /** Twitter/X */
  twitter?: string;
  /** LinkedIn */
  linkedin?: string;
  /** 个人博客 */
  blog?: string;
}

/** 用户注册请求 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

/** 用户登录请求 */
export interface LoginRequest {
  /** 登录方式：邮箱或用户名 */
  account: string;
  password: string;
}

/** 登录响应（含Token） */
export interface LoginResponse {
  user: User;
  profile: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** 更新用户资料请求 */
export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  gender?: Gender;
  birthday?: Timestamp;
  socialLinks?: Partial<SocialLinks>;
  tags?: string[];
}

/** 修改密码请求 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ============================================================
// OPC智能体相关类型
// ============================================================

/** OPC智能体状态 */
export type AgentStatus = 'draft' | 'active' | 'inactive' | 'archived';

/** OPC智能体类型 */
export type AgentType = 'assistant' | 'creative' | 'analytical' | 'social' | 'commercial';

/** OPC智能体配置 */
export interface AgentConfig {
  /** 模型名称 */
  model: string;
  /** 温度参数 (0-1) */
  temperature: number;
  /** 最大Token数 */
  maxTokens: number;
  /** Top-P采样参数 */
  topP: number;
  /** 频率惩罚 (-2 到 2) */
  frequencyPenalty: number;
  /** 存在惩罚 (-2 到 2) */
  presencePenalty: number;
  /** 系统提示词 */
  systemPrompt: string;
  /** 自定义参数 */
  customParams?: Record<string, unknown>;
}

/** OPC智能体/角色配置 */
export interface OPCProfile {
  /** 智能体唯一ID */
  id: ID;
  /** 所属用户ID */
  userId: ID;
  /** 智能体名称 */
  name: string;
  /** 智能体描述 */
  description: string;
  /** 智能体类型 */
  type: AgentType;
  /** 智能体状态 */
  status: AgentStatus;
  /** 头像URL */
  avatar?: string;
  /** 智能体配置 */
  config: AgentConfig;
  /** 智能体能力标签 */
  capabilities: string[];
  /** 是否公开可见 */
  isPublic: boolean;
  /** 使用次数 */
  usageCount: number;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 智能体创建请求 */
export interface CreateAgentRequest {
  name: string;
  description: string;
  type: AgentType;
  config: Partial<AgentConfig>;
  capabilities?: string[];
  isPublic?: boolean;
}

/** 智能体更新请求 */
export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  type?: AgentType;
  status?: AgentStatus;
  config?: Partial<AgentConfig>;
  capabilities?: string[];
  isPublic?: boolean;
}

// ============================================================
// 对话与消息类型
// ============================================================

/** 对话状态 */
export type ConversationStatus = 'active' | 'archived' | 'deleted';

/** 对话类型 */
export type ConversationType = 'private' | 'group' | 'agent';

/** 对话 */
export interface Conversation {
  /** 对话唯一ID */
  id: ID;
  /** 参与用户ID列表 */
  participantIds: ID[];
  /** 关联的智能体ID（如果是智能体对话） */
  agentId?: ID;
  /** 对话标题 */
  title: string;
  /** 对话类型 */
  type: ConversationType;
  /** 对话状态 */
  status: ConversationStatus;
  /** 最后一条消息 */
  lastMessage?: Message;
  /** 未读消息数（按用户ID索引） */
  unreadCount: Record<ID, number>;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system';

/** 消息状态 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/** 消息类型 */
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';

/** 消息 */
export interface Message {
  /** 消息唯一ID */
  id: ID;
  /** 所属对话ID */
  conversationId: ID;
  /** 发送者ID（系统消息为空） */
  senderId?: ID;
  /** 关联的智能体ID */
  agentId?: ID;
  /** 消息角色 */
  role: MessageRole;
  /** 消息类型 */
  type: MessageType;
  /** 消息内容 */
  content: string;
  /** 附件列表 */
  attachments: Attachment[];
  /** 消息状态 */
  status: MessageStatus;
  /** 引用回复的消息ID */
  replyToId?: ID;
  /** Token使用统计 */
  tokenUsage?: TokenUsage;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 附件 */
export interface Attachment {
  /** 附件ID */
  id: ID;
  /** 文件名 */
  filename: string;
  /** 文件MIME类型 */
  mimeType: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件URL */
  url: string;
  /** 缩略图URL */
  thumbnailUrl?: string;
}

/** Token使用统计 */
export interface TokenUsage {
  /** 提示Token数 */
  promptTokens: number;
  /** 补全Token数 */
  completionTokens: number;
  /** 总Token数 */
  totalTokens: number;
}

/** 发送消息请求 */
export interface SendMessageRequest {
  conversationId: ID;
  content: string;
  type?: MessageType;
  attachments?: Omit<Attachment, 'id'>[];
  replyToId?: ID;
}

// ============================================================
// 内容相关类型（帖子、评论）
// ============================================================

/** 内容状态 */
export type ContentStatus = 'draft' | 'published' | 'archived' | 'deleted';

/** 帖子 */
export interface Post {
  /** 帖子唯一ID */
  id: ID;
  /** 作者用户ID */
  authorId: ID;
  /** 标题 */
  title: string;
  /** 正文内容（支持Markdown） */
  content: string;
  /** 摘要 */
  excerpt?: string;
  /** 封面图URL */
  coverImage?: string;
  /** 标签列表 */
  tags: string[];
  /** 分类ID */
  categoryId?: ID;
  /** 帖子状态 */
  status: ContentStatus;
  /** 浏览量 */
  viewCount: number;
  /** 点赞数 */
  likeCount: number;
  /** 评论数 */
  commentCount: number;
  /** 收藏数 */
  bookmarkCount: number;
  /** 是否置顶 */
  isPinned: boolean;
  /** 是否精选 */
  isFeatured: boolean;
  /** 关联的智能体ID */
  agentId?: ID;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
  /** 发布时间 */
  publishedAt?: Timestamp;
}

/** 创建帖子请求 */
export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  categoryId?: ID;
  status?: ContentStatus;
  agentId?: ID;
}

/** 更新帖子请求 */
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  categoryId?: ID;
  status?: ContentStatus;
}

/** 评论 */
export interface Comment {
  /** 评论唯一ID */
  id: ID;
  /** 所属帖子ID */
  postId: ID;
  /** 评论者用户ID */
  authorId: ID;
  /** 父评论ID（顶级评论为空） */
  parentId?: ID;
  /** 回复的目标用户ID */
  replyToUserId?: ID;
  /** 评论内容 */
  content: string;
  /** 点赞数 */
  likeCount: number;
  /** 回复数 */
  replyCount: number;
  /** 评论状态 */
  status: ContentStatus;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 创建评论请求 */
export interface CreateCommentRequest {
  postId: ID;
  content: string;
  parentId?: ID;
  replyToUserId?: ID;
}

// ============================================================
// 商品与订单类型
// ============================================================

/** 商品状态 */
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'archived';

/** 商品类型 */
export type ProductType = 'digital' | 'physical' | 'service' | 'subscription';

/** 商品 */
export interface Product {
  /** 商品唯一ID */
  id: ID;
  /** 卖家用户ID */
  sellerId: ID;
  /** 商品名称 */
  name: string;
  /** 商品描述 */
  description: string;
  /** 商品详情（富文本） */
  detail?: string;
  /** 商品类型 */
  type: ProductType;
  /** 商品状态 */
  status: ProductStatus;
  /** 价格（单位：分） */
  price: number;
  /** 原价（单位：分） */
  originalPrice?: number;
  /** 库存数量 */
  stock: number;
  /** 已售数量 */
  salesCount: number;
  /** 商品图片列表 */
  images: string[];
  /** 封面图URL */
  coverImage?: string;
  /** 商品分类ID */
  categoryId?: ID;
  /** 标签列表 */
  tags: string[];
  /** 商品规格选项 */
  specifications: ProductSpecification[];
  /** 评分（1-5） */
  rating: number;
  /** 评价数量 */
  reviewCount: number;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 商品规格 */
export interface ProductSpecification {
  /** 规格名称（如"颜色"、"尺寸"） */
  name: string;
  /** 规格可选值 */
  options: string[];
}

/** 商品SKU */
export interface ProductSku {
  /** SKU唯一ID */
  id: ID;
  /** 关联商品ID */
  productId: ID;
  /** SKU编码 */
  sku: string;
  /** 规格组合（如 {"颜色": "红色", "尺寸": "XL"}） */
  attributes: Record<string, string>;
  /** 价格（单位：分） */
  price: number;
  /** 库存数量 */
  stock: number;
}

/** 创建商品请求 */
export interface CreateProductRequest {
  name: string;
  description: string;
  detail?: string;
  type: ProductType;
  price: number;
  originalPrice?: number;
  stock: number;
  images?: string[];
  coverImage?: string;
  categoryId?: ID;
  tags?: string[];
  specifications?: ProductSpecification[];
}

/** 订单状态 */
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

/** 支付方式 */
export type PaymentMethod = 'alipay' | 'wechat' | 'credit_card' | 'bank_transfer';

/** 订单 */
export interface Order {
  /** 订单唯一ID */
  id: ID;
  /** 订单编号 */
  orderNo: string;
  /** 买家用户ID */
  buyerId: ID;
  /** 卖家用户ID */
  sellerId: ID;
  /** 订单状态 */
  status: OrderStatus;
  /** 订单商品项列表 */
  items: OrderItem[];
  /** 商品总金额（单位：分） */
  totalAmount: number;
  /** 运费（单位：分） */
  shippingFee: number;
  /** 优惠金额（单位：分） */
  discountAmount: number;
  /** 实付金额（单位：分） */
  paidAmount: number;
  /** 支付方式 */
  paymentMethod?: PaymentMethod;
  /** 支付时间 */
  paidAt?: Timestamp;
  /** 发货时间 */
  shippedAt?: Timestamp;
  /** 收货时间 */
  deliveredAt?: Timestamp;
  /** 收货地址 */
  shippingAddress?: ShippingAddress;
  /** 买家备注 */
  buyerNote?: string;
  /** 卖家备注 */
  sellerNote?: string;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 订单商品项 */
export interface OrderItem {
  /** 订单项唯一ID */
  id: ID;
  /** 关联订单ID */
  orderId: ID;
  /** 商品ID */
  productId: ID;
  /** 商品名称（下单时快照） */
  productName: string;
  /** 商品图片（下单时快照） */
  productImage?: string;
  /** SKU ID */
  skuId?: ID;
  /** SKU属性（下单时快照） */
  skuAttributes?: Record<string, string>;
  /** 单价（单位：分） */
  unitPrice: number;
  /** 购买数量 */
  quantity: number;
  /** 小计金额（单位：分） */
  subtotal: number;
}

/** 收货地址 */
export interface ShippingAddress {
  /** 收件人姓名 */
  name: string;
  /** 联系电话 */
  phone: string;
  /** 省份 */
  province: string;
  /** 城市 */
  city: string;
  /** 区/县 */
  district: string;
  /** 详细地址 */
  address: string;
  /** 邮政编码 */
  postalCode?: string;
}

/** 创建订单请求 */
export interface CreateOrderRequest {
  items: {
    productId: ID;
    skuId?: ID;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  buyerNote?: string;
}

// ============================================================
// 圈子/社区类型
// ============================================================

/** 圈子状态 */
export type CircleStatus = 'active' | 'inactive' | 'archived';

/** 圈子成员角色 */
export type CircleMemberRole = 'owner' | 'admin' | 'member';

/** 圈子/社区 */
export interface Circle {
  /** 圈子唯一ID */
  id: ID;
  /** 圈子名称 */
  name: string;
  /** 圈子描述 */
  description: string;
  /** 圈子头像URL */
  avatar?: string;
  /** 圈子封面图URL */
  coverImage?: string;
  /** 圈子状态 */
  status: CircleStatus;
  /** 创建者用户ID */
  ownerId: ID;
  /** 成员数量 */
  memberCount: number;
  /** 帖子数量 */
  postCount: number;
  /** 圈子标签 */
  tags: string[];
  /** 圈子规则 */
  rules?: string;
  /** 是否公开（公开可搜索加入，私密需邀请） */
  isPublic: boolean;
  /** 加入是否需要审核 */
  requiresApproval: boolean;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 圈子成员 */
export interface CircleMember {
  /** 成员记录唯一ID */
  id: ID;
  /** 圈子ID */
  circleId: ID;
  /** 用户ID */
  userId: ID;
  /** 成员角色 */
  role: CircleMemberRole;
  /** 加入时间 */
  joinedAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

/** 创建圈子请求 */
export interface CreateCircleRequest {
  name: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  tags?: string[];
  rules?: string;
  isPublic?: boolean;
  requiresApproval?: boolean;
}

/** 更新圈子请求 */
export interface UpdateCircleRequest {
  name?: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  status?: CircleStatus;
  tags?: string[];
  rules?: string;
  isPublic?: boolean;
  requiresApproval?: boolean;
}

// ============================================================
// 通知类型
// ============================================================

/** 通知类型 */
export type NotificationType =
  | 'like'
  | 'comment'
  | 'reply'
  | 'follow'
  | 'mention'
  | 'system'
  | 'order'
  | 'circle';

/** 通知状态 */
export type NotificationStatus = 'unread' | 'read';

/** 通知 */
export interface Notification {
  /** 通知唯一ID */
  id: ID;
  /** 接收者用户ID */
  recipientId: ID;
  /** 发送者用户ID */
  senderId?: ID;
  /** 通知类型 */
  type: NotificationType;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 关联资源类型 */
  resourceType?: string;
  /** 关联资源ID */
  resourceId?: ID;
  /** 通知状态 */
  status: NotificationStatus;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 阅读时间 */
  readAt?: Timestamp;
}

// ============================================================
// 文件上传类型
// ============================================================

/** 文件上传响应 */
export interface UploadResponse {
  /** 文件唯一ID */
  id: ID;
  /** 文件名 */
  filename: string;
  /** 文件MIME类型 */
  mimeType: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件访问URL */
  url: string;
  /** 缩略图URL */
  thumbnailUrl?: string;
}
