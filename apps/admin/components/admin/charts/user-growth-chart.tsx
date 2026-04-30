'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * 用户增长图表模拟数据
 */
const mockData = [
  { date: '04-01', 新增用户: 120, 累计用户: 3200 },
  { date: '04-02', 新增用户: 85, 累计用户: 3285 },
  { date: '04-03', 新增用户: 156, 累计用户: 3441 },
  { date: '04-04', 新增用户: 98, 累计用户: 3539 },
  { date: '04-05', 新增用户: 210, 累计用户: 3749 },
  { date: '04-06', 新增用户: 175, 累计用户: 3924 },
  { date: '04-07', 新增用户: 142, 累计用户: 4066 },
  { date: '04-08', 新增用户: 198, 累计用户: 4264 },
  { date: '04-09', 新增用户: 167, 累计用户: 4431 },
  { date: '04-10', 新增用户: 223, 累计用户: 4654 },
  { date: '04-11', 新增用户: 189, 累计用户: 4843 },
  { date: '04-12', 新增用户: 245, 累计用户: 5088 },
  { date: '04-13', 新增用户: 201, 累计用户: 5289 },
  { date: '04-14', 新增用户: 178, 累计用户: 5467 },
];

/**
 * 自定义Tooltip组件
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-medium text-gray-900">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * 用户增长趋势图表组件
 * 展示用户注册增长趋势（折线/面积图）
 */
export default function UserGrowthChart() {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">用户增长趋势</h3>
          <p className="text-sm text-gray-500 mt-0.5">近14天用户注册数据</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-gray-500">新增用户</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-500">累计用户</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTotalUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94A3B8' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94A3B8' }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={() => null} />
          <Area
            type="monotone"
            dataKey="累计用户"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#colorTotalUsers)"
            yAxisId={0}
          />
          <Area
            type="monotone"
            dataKey="新增用户"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#colorNewUsers)"
            yAxisId={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
