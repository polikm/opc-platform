import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

// 字体配置
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
});

// QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分钟
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 站点元数据
export const metadata: Metadata = {
  title: {
    default: "OPC智能体平台 - 构建你的AI智能体",
    template: "%s | OPC智能体平台",
  },
  description:
    "OPC智能体平台是一个面向主理人的AI智能体创建与管理平台，提供智能体创建、知识库管理、社区协作等一站式服务。",
  keywords: ["OPC", "智能体", "AI", "Agent", "主理人", "知识库"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansSC.variable} font-sans min-h-screen bg-background text-foreground`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
