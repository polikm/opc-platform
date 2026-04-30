'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * 对话量统计模拟数据
 */
const mockData = [
  { date: '04-01', 对话总量: 1580, 独立用户: 420 },
  { date: '04-02', 对话总量: 1320, 独立用户: 380 },
  { date: '04-03', 对话总量: 1890, 独立用户: 510 },
  { date: '04-04', 对话总量: 1650, 独立用户: 460 },
  { date: '04-05', 对话总量: 2100, 独立用户: 580 },
  { date: '04-06', 对话总量: 1780, 独立用户: 490 },
  { date: '04-07', 对话总量: 1450, 独立用户: 400 },
  { date: '04-08', 对话总量: 2340, 独立用户: 620 },
  { date: '04-09', 对话总量: 1980, 独立用户: 540 },
  { date: '04-10', 对话总量: 2560, 独立用户: 680 },
  { date: '04-11', 对话总量: 2150, 独立用户: 590 },
  { date: '04-12', 对话总量: 2780, 独立用户: 720 },
  { date: '04-13', 对话总量: 2420, 独立用户: 650 },
  { date: '04-14', 对话总量: 2050, 独立用户: 560 },
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
 * 对话量统计图表组件
 * 展示每日对话量和独立用户数（柱状图）
 */
export default function ConversationChart() {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">对话量统计</h3>
          <p className="text-sm text-gray-500 mt-0.5">近14天对话数据</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-gray-500">对话总量</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-500">独立用户</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          <Bar
            dataKey="对话总量"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Bar
            dataKey="独立用户"
            fill="#A855F7"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
