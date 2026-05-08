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
  Zap,
  Menu,
  X,
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
  { href: "/admin/integrations", label: "Integrações", icon: Zap },
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

// Member sees same as admin, minus Users and Configurações — own /member/* URLs
const memberNav: NavItem[] = [
  { href: "/member", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/member/clients", label: "Clientes", icon: Building2 },
  { href: "/member/reports", label: "Relatórios", icon: FileBarChart },
  { href: "/member/import", label: "Importar Dados", icon: Upload },
  { href: "/member/integrations", label: "Integrações", icon: Zap },
]

interface SidebarProps {
  role: "admin" | "client" | "member"
  clientName?: string
  userName?: string
}

function NavContent({
  role,
  clientName,
  userName,
  collapsed,
  setCollapsed,
  onNavClick,
}: SidebarProps & { collapsed: boolean; setCollapsed: (v: boolean) => void; onNavClick?: () => void }) {
  const pathname = usePathname()
  const navItems = role === "admin" ? adminNav : role === "member" ? memberNav : clientNav

  return (
    <div className="flex flex-col h-full">
      <div className={cn("flex items-center h-16 px-4 border-b border-gray-800 flex-shrink-0", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
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
          className="p-1 rounded-md hover:bg-gray-800 text-gray-400 transition-colors hidden lg:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {role === "client" && !collapsed && clientName && (
        <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <p className="text-xs text-gray-500">Empresa</p>
          <p className="text-sm font-semibold text-white truncate">{clientName}</p>
        </div>
      )}

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs text-gray-600 px-2 pb-2 uppercase tracking-wider font-medium">
            {role === "admin" ? "Administração" : role === "member" ? "Painel" : "Meu Dashboard"}
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
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

      <div className={cn("border-t border-gray-800 p-3 flex-shrink-0", collapsed ? "flex justify-center" : "")}>
        {!collapsed && userName && (
          <div className="mb-2 px-2">
            <p className="text-xs text-gray-500">Logado como</p>
            <p className="text-sm text-gray-300 truncate font-medium">{userName}</p>
          </div>
        )}
        <Link
          href="/login"
          onClick={onNavClick}
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
    </div>
  )
}

export function Sidebar({ role, clientName, userName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState<string | null>(null)
  const pathname = usePathname()

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (mobileOpen) setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-950 border-b border-gray-800 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">TrafficDash</span>
        </div>
        {clientName && role === "client" && (
          <span className="ml-auto text-xs text-gray-400 truncate max-w-[120px]">{clientName}</span>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-gray-950 text-white border-r border-gray-800 transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">TrafficDash</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          <NavContent
            role={role}
            clientName={clientName}
            userName={userName}
            collapsed={false}
            setCollapsed={() => {}}
            onNavClick={() => setMobileOpen(false)}
          />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-gray-950 text-white border-r border-gray-800 transition-all duration-200 flex-shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <NavContent
          role={role}
          clientName={clientName}
          userName={userName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>
    </>
  )
}
