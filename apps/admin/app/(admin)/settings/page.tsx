'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Save,
  Globe,
  Bot,
  CreditCard,
  Bell,
  Key,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
} from 'lucide-react';

/**
 * 系统设置页面
 * 包含基本设置、模型配置、支付配置和通知配置
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 基本设置状态
  const [basicSettings, setBasicSettings] = useState({
    platformName: 'OPC智能体平台',
    platformDescription: '下一代智能体创作与交互平台',
    platformUrl: 'https://opc.ai',
    logoUrl: '',
    faviconUrl: '',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
  });

  // 模型配置状态
  const [modelSettings, setModelSettings] = useState({
    defaultModel: 'gpt-4',
    availableModels: 'gpt-4,gpt-4-turbo,gpt-3.5-turbo,claude-3-opus,claude-3-sonnet',
    maxTokensPerRequest: 4096,
    freeTokenQuota: 10000,
    vipTokenQuota: 100000,
    developerTokenQuota: 500000,
    enableStreaming: true,
    enableFunctionCalling: true,
  });

  // 支付配置状态
  const [paymentSettings, setPaymentSettings] = useState({
    enabled: true,
    currency: 'CNY',
    stripeEnabled: false,
    stripePublicKey: '',
    wechatPayEnabled: true,
    wechatPayMerchantId: '',
    alipayEnabled: true,
    alipayAppId: '',
    minimumRecharge: 10,
  });

  // 通知配置状态
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    emailSmtpHost: 'smtp.opc.ai',
    emailSmtpPort: 465,
    emailFromAddress: 'noreply@opc.ai',
    smsEnabled: false,
    smsProvider: '',
    pushEnabled: true,
    newAgentNotification: true,
    reportNotification: true,
    systemAlertNotification: true,
  });

  // 保存设置
  const handleSave = async () => {
    setSaving(true);
    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Tab配置
  const tabs = [
    { id: 'basic', label: '基本设置', icon: Globe },
    { id: 'model', label: '模型配置', icon: Bot },
    { id: 'payment', label: '支付配置', icon: CreditCard },
    { id: 'notification', label: '通知配置', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-sm text-gray-500 mt-1">配置平台参数、模型、支付和通知</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? '保存中...' : saved ? '已保存' : '保存设置'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* 左侧Tab导航 */}
        <div className="w-56 flex-shrink-0">
          <div className="admin-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧设置内容 */}
        <div className="flex-1">
          {/* 基本设置 */}
          {activeTab === 'basic' && (
            <div className="admin-card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">基本设置</h2>
                <p className="text-sm text-gray-500 mt-1">配置平台基本信息和外观</p>
              </div>
              <div className="p-6 space-y-6">
                {/* 平台名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    平台名称
                  </label>
                  <input
                    type="text"
                    value={basicSettings.platformName}
                    onChange={(e) => setBasicSettings({ ...basicSettings, platformName: e.target.value })}
                    className="admin-input"
                    placeholder="请输入平台名称"
                  />
                  <p className="text-xs text-gray-400 mt-1">显示在浏览器标题栏和Logo处</p>
                </div>

                {/* 平台描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    平台描述
                  </label>
                  <textarea
                    value={basicSettings.platformDescription}
                    onChange={(e) => setBasicSettings({ ...basicSettings, platformDescription: e.target.value })}
                    className="admin-input min-h-[80px] resize-y"
                    placeholder="请输入平台描述"
                  />
                  <p className="text-xs text-gray-400 mt-1">用于SEO和平台介绍</p>
                </div>

                {/* 平台URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    平台URL
                  </label>
                  <input
                    type="url"
                    value={basicSettings.platformUrl}
                    onChange={(e) => setBasicSettings({ ...basicSettings, platformUrl: e.target.value })}
                    className="admin-input"
                    placeholder="https://"
                  />
                </div>

                {/* Logo和Favicon */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={basicSettings.logoUrl}
                      onChange={(e) => setBasicSettings({ ...basicSettings, logoUrl: e.target.value })}
                      className="admin-input"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Favicon URL
                    </label>
                    <input
                      type="text"
                      value={basicSettings.faviconUrl}
                      onChange={(e) => setBasicSettings({ ...basicSettings, faviconUrl: e.target.value })}
                      className="admin-input"
                      placeholder="https://"
                    />
                  </div>
                </div>

                {/* 语言和时区 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      默认语言
                    </label>
                    <select
                      value={basicSettings.language}
                      onChange={(e) => setBasicSettings({ ...basicSettings, language: e.target.value })}
                      className="admin-input"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="zh-TW">繁体中文</option>
                      <option value="en">English</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      时区
                    </label>
                    <select
                      value={basicSettings.timezone}
                      onChange={(e) => setBasicSettings({ ...basicSettings, timezone: e.target.value })}
                      className="admin-input"
                    >
                      <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 模型配置 */}
          {activeTab === 'model' && (
            <div className="admin-card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">模型配置</h2>
                <p className="text-sm text-gray-500 mt-1">配置AI模型参数和Token配额</p>
              </div>
              <div className="p-6 space-y-6">
                {/* 默认模型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    默认模型
                  </label>
                  <select
                    value={modelSettings.defaultModel}
                    onChange={(e) => setModelSettings({ ...modelSettings, defaultModel: e.target.value })}
                    className="admin-input"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>

                {/* 可用模型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    可用模型列表
                  </label>
                  <input
                    type="text"
                    value={modelSettings.availableModels}
                    onChange={(e) => setModelSettings({ ...modelSettings, availableModels: e.target.value })}
                    className="admin-input"
                    placeholder="逗号分隔的模型名称"
                  />
                  <p className="text-xs text-gray-400 mt-1">多个模型用英文逗号分隔</p>
                </div>

                {/* 最大Token数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    单次请求最大Token数
                  </label>
                  <input
                    type="number"
                    value={modelSettings.maxTokensPerRequest}
                    onChange={(e) => setModelSettings({ ...modelSettings, maxTokensPerRequest: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>

                {/* Token配额 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Token配额设置
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">免费用户</p>
                      <input
                        type="number"
                        value={modelSettings.freeTokenQuota}
                        onChange={(e) => setModelSettings({ ...modelSettings, freeTokenQuota: Number(e.target.value) })}
                        className="admin-input"
                      />
                      <p className="text-xs text-gray-400 mt-1">Token/天</p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">VIP用户</p>
                      <input
                        type="number"
                        value={modelSettings.vipTokenQuota}
                        onChange={(e) => setModelSettings({ ...modelSettings, vipTokenQuota: Number(e.target.value) })}
                        className="admin-input"
                      />
                      <p className="text-xs text-gray-400 mt-1">Token/天</p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">开发者</p>
                      <input
                        type="number"
                        value={modelSettings.developerTokenQuota}
                        onChange={(e) => setModelSettings({ ...modelSettings, developerTokenQuota: Number(e.target.value) })}
                        className="admin-input"
                      />
                      <p className="text-xs text-gray-400 mt-1">Token/天</p>
                    </div>
                  </div>
                </div>

                {/* 功能开关 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    功能开关
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">流式输出</span>
                      </div>
                      <div
                        className={cn(
                          'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                          modelSettings.enableStreaming ? 'bg-primary' : 'bg-gray-300'
                        )}
                        onClick={() => setModelSettings({ ...modelSettings, enableStreaming: !modelSettings.enableStreaming })}
                      >
                        <div className={cn(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          modelSettings.enableStreaming ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                        )} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">函数调用 (Function Calling)</span>
                      </div>
                      <div
                        className={cn(
                          'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                          modelSettings.enableFunctionCalling ? 'bg-primary' : 'bg-gray-300'
                        )}
                        onClick={() => setModelSettings({ ...modelSettings, enableFunctionCalling: !modelSettings.enableFunctionCalling })}
                      >
                        <div className={cn(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          modelSettings.enableFunctionCalling ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                        )} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 支付配置 */}
          {activeTab === 'payment' && (
            <div className="admin-card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">支付配置</h2>
                <p className="text-sm text-gray-500 mt-1">配置支付渠道和充值参数</p>
              </div>
              <div className="p-6 space-y-6">
                {/* 支付总开关 */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">启用支付功能</p>
                      <p className="text-xs text-gray-400">开启后用户可以进行充值和购买操作</p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                      paymentSettings.enabled ? 'bg-primary' : 'bg-gray-300'
                    )}
                    onClick={() => setPaymentSettings({ ...paymentSettings, enabled: !paymentSettings.enabled })}
                  >
                    <div className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                      paymentSettings.enabled ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                    )} />
                  </div>
                </div>

                {/* 最低充值金额 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    最低充值金额 (元)
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.minimumRecharge}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, minimumRecharge: Number(e.target.value) })}
                    className="admin-input w-48"
                  />
                </div>

                {/* 微信支付 */}
                <div className="p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">微信支付</span>
                    </div>
                    <div
                      className={cn(
                        'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                        paymentSettings.wechatPayEnabled ? 'bg-primary' : 'bg-gray-300'
                      )}
                      onClick={() => setPaymentSettings({ ...paymentSettings, wechatPayEnabled: !paymentSettings.wechatPayEnabled })}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        paymentSettings.wechatPayEnabled ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                      )} />
                    </div>
                  </div>
                  {paymentSettings.wechatPayEnabled && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">商户号</label>
                      <input
                        type="text"
                        value={paymentSettings.wechatPayMerchantId}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, wechatPayMerchantId: e.target.value })}
                        className="admin-input"
                        placeholder="请输入微信支付商户号"
                      />
                    </div>
                  )}
                </div>

                {/* 支付宝 */}
                <div className="p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">支付宝</span>
                    </div>
                    <div
                      className={cn(
                        'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                        paymentSettings.alipayEnabled ? 'bg-primary' : 'bg-gray-300'
                      )}
                      onClick={() => setPaymentSettings({ ...paymentSettings, alipayEnabled: !paymentSettings.alipayEnabled })}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        paymentSettings.alipayEnabled ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                      )} />
                    </div>
                  </div>
                  {paymentSettings.alipayEnabled && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">App ID</label>
                      <input
                        type="text"
                        value={paymentSettings.alipayAppId}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, alipayAppId: e.target.value })}
                        className="admin-input"
                        placeholder="请输入支付宝App ID"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 通知配置 */}
          {activeTab === 'notification' && (
            <div className="admin-card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">通知配置</h2>
                <p className="text-sm text-gray-500 mt-1">配置系统通知渠道和通知规则</p>
              </div>
              <div className="p-6 space-y-6">
                {/* 邮件通知 */}
                <div className="p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">邮件通知</span>
                    </div>
                    <div
                      className={cn(
                        'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                        notificationSettings.emailEnabled ? 'bg-primary' : 'bg-gray-300'
                      )}
                      onClick={() => setNotificationSettings({ ...notificationSettings, emailEnabled: !notificationSettings.emailEnabled })}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        notificationSettings.emailEnabled ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                      )} />
                    </div>
                  </div>
                  {notificationSettings.emailEnabled && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">SMTP服务器</label>
                          <input
                            type="text"
                            value={notificationSettings.emailSmtpHost}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailSmtpHost: e.target.value })}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">SMTP端口</label>
                          <input
                            type="number"
                            value={notificationSettings.emailSmtpPort}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailSmtpPort: Number(e.target.value) })}
                            className="admin-input"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">发件人地址</label>
                        <input
                          type="email"
                          value={notificationSettings.emailFromAddress}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, emailFromAddress: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 短信通知 */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">短信通知</span>
                    </div>
                    <div
                      className={cn(
                        'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                        notificationSettings.smsEnabled ? 'bg-primary' : 'bg-gray-300'
                      )}
                      onClick={() => setNotificationSettings({ ...notificationSettings, smsEnabled: !notificationSettings.smsEnabled })}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        notificationSettings.smsEnabled ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                      )} />
                    </div>
                  </div>
                </div>

                {/* 推送通知 */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">站内推送</span>
                    </div>
                    <div
                      className={cn(
                        'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                        notificationSettings.pushEnabled ? 'bg-primary' : 'bg-gray-300'
                      )}
                      onClick={() => setNotificationSettings({ ...notificationSettings, pushEnabled: !notificationSettings.pushEnabled })}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        notificationSettings.pushEnabled ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                      )} />
                    </div>
                  </div>
                </div>

                {/* 通知规则 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    通知规则
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'newAgentNotification', label: '新智能体提交审核时通知管理员', icon: Bot },
                      { key: 'reportNotification', label: '收到用户举报时通知管理员', icon: Shield },
                      { key: 'systemAlertNotification', label: '系统异常时发送告警通知', icon: Bell },
                    ].map((rule) => (
                      <label
                        key={rule.key}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <rule.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{rule.label}</span>
                        </div>
                        <div
                          className={cn(
                            'w-10 h-6 rounded-full relative transition-colors cursor-pointer',
                            (notificationSettings as any)[rule.key] ? 'bg-primary' : 'bg-gray-300'
                          )}
                          onClick={() =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [rule.key]: !(notificationSettings as any)[rule.key],
                            })
                          }
                        >
                          <div className={cn(
                            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                            (notificationSettings as any)[rule.key] ? 'translate-x-4.5 left-0.5' : 'left-0.5'
                          )} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
