"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  FileBarChart,
  Upload,
  TrendingUp,
  Target,
  Globe,
  MessageSquare,
  GitBranch,
  DollarSign,
  Brain,
  CheckSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clientes", icon: Building2 },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/reports", label: "Relatórios", icon: FileBarChart },
  { href: "/admin/import", label: "Importar Dados", icon: Upload },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
]

const clientNav: NavItem[] = [
  { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/google-ads", label: "Google Ads", icon: Target },
  { href: "/client/meta-ads", label: "Meta Ads", icon: TrendingUp },
  { href: "/client/ga4", label: "Site / GA4", icon: Globe },
  { href: "/client/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { href: "/client/funnel", label: "Funil", icon: GitBranch },
  { href: "/client/financial", label: "Financeiro", icon: DollarSign },
  { href: "/client/diagnostic", label: "Diagnóstico", icon: Brain },
  { href: "/client/action-plan", label: "Plano de Ação", icon: CheckSquare },
]

const memberNav: NavItem[] = [
  { href: "/member", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/member/clients", label: "Meus Clientes", icon: Building2 },
  { href: "/member/action-plan", label: "Planos de Ação", icon: CheckSquare },
  { href: "/member/reports", label: "Relatórios", icon: FileBarChart },
  { href: "/member/import", label: "Importar Dados", icon: Upload },
]

interface SidebarProps {
  role: "admin" | "client" | "member"
  clientName?: string
  userName?: string
}

export function Sidebar({ role, clientName, userName }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const navItems = role === "admin" ? adminNav : role === "member" ? memberNav : clientNav

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-gray-950 text-white border-r border-gray-800 transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-gray-800", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">TrafficDash</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("p-1 rounded-md hover:bg-gray-800 text-gray-400 transition-colors", collapsed && "mt-0")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Client info (for client role) */}
      {role === "client" && !collapsed && clientName && (
        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-xs text-gray-500">Empresa</p>
          <p className="text-sm font-semibold text-white truncate">{clientName}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs text-gray-600 px-2 pb-2 uppercase tracking-wider font-medium">
            {role === "admin" ? "Administração" : role === "member" ? "Área de Membros" : "Meu Dashboard"}
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className={cn("border-t border-gray-800 p-3", collapsed ? "flex justify-center" : "")}>
        {!collapsed && userName && (
          <div className="mb-2 px-2">
            <p className="text-xs text-gray-500">Logado como</p>
            <p className="text-sm text-gray-300 truncate font-medium">{userName}</p>
          </div>
        )}
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </div>
    </aside>
  )
}
