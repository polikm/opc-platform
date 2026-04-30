"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Palette,
  Camera,
  Save,
} from "lucide-react";

/**
 * 个人档案页
 */
export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">个人档案</h2>
        <p className="text-neutral-500 mt-1">管理你的账户信息和个人设置</p>
      </div>

      {/* 头像区域 */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
              张
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">张主理人</h3>
            <p className="text-sm text-neutral-500">pro@opc.com</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
              <Shield className="w-3 h-3" />
              专业版会员
            </span>
          </div>
        </div>
      </div>

      {/* 基本信息 */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900">基本信息</h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  defaultValue="张主理人"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  defaultValue="138****8888"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  defaultValue="pro@opc.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                所在地区
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  defaultValue="北京市"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              个人简介
            </label>
            <textarea
              defaultValue="专注于AI智能体应用的主理人，致力于用技术提升客户服务体验。"
              rows={3}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* 账户信息 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">账户信息</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="w-4 h-4 text-neutral-400" />
                注册时间
              </div>
              <span className="text-sm font-medium text-neutral-900">
                2026-01-15
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Shield className="w-4 h-4 text-neutral-400" />
                会员等级
              </div>
              <span className="text-sm font-medium text-primary-600">
                专业版
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Palette className="w-4 h-4 text-neutral-400" />
                智能体数量
              </div>
              <span className="text-sm font-medium text-neutral-900">
                3 / 10
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Bell className="w-4 h-4 text-neutral-400" />
                知识库容量
              </div>
              <span className="text-sm font-medium text-neutral-900">
                24MB / 100MB
              </span>
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">通知设置</h3>

          {[
            {
              label: "邮件通知",
              desc: "接收重要更新和系统通知邮件",
              checked: true,
            },
            {
              label: "对话提醒",
              desc: "当智能体收到新消息时通知我",
              checked: true,
            },
            {
              label: "社区动态",
              desc: "关注的话题有新回复时通知我",
              checked: false,
            },
            {
              label: "产品更新",
              desc: "接收新功能和产品改进通知",
              checked: true,
            },
          ].map((setting) => (
            <div
              key={setting.label}
              className="flex items-center justify-between py-2"
            >
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  {setting.label}
                </div>
                <div className="text-xs text-neutral-400">{setting.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={setting.checked}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
              </label>
            </div>
          ))}
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存修改
          </button>
        </div>
      </form>
    </div>
  );
}
