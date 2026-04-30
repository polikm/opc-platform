import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

/**
 * 管理后台根元数据
 */
export const metadata: Metadata = {
  title: 'OPC智能体系统 - 管理后台',
  description: 'OPC智能体系统管理后台，提供用户管理、智能体管理、内容审核、数据分析等功能',
};

/**
 * 管理后台根布局
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
