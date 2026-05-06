"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { UserCircle, Shield, User, Building2, ArrowLeft, Key, Trash2, Save, Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers, mockClients } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  member: "Membro",
  client: "Cliente",
}

const activityHistory = [
  { date: "2024-05-06T08:00:00Z", action: "Login realizado", type: "login" },
  { date: "2024-05-05T16:00:00Z", action: "Plano de ação aprovado — Clínica Saúde Total", type: "action" },
  { date: "2024-05-04T14:00:00Z", action: "Dados importados — Meta Ads", type: "import" },
  { date: "2024-05-03T10:30:00Z", action: "Relatório publicado — Abril 2024", type: "report" },
  { date: "2024-05-02T09:15:00Z", action: "Login realizado", type: "login" },
]

export default function AdminUserDetailPage() {
  const params = useParams()
  const id = params.id as string

  const user = mockUsers.find((u) => u.id === id)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [role, setRole] = useState<UserRole>(user?.role || "member")
  const [assignedClients, setAssignedClients] = useState<string[]>(user?.assigned_clients || [])
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  if (!user) {
    return (
      <div className="text-center py-16">
        <UserCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Usuário não encontrado</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/users">Voltar para Usuários</Link>
        </Button>
      </div>
    )
  }

  const linkedClient = user.client_id ? mockClients.find((c) => c.id === user.client_id) : null

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePasswordReset() {
    setPasswordSaved(true)
    setNewPassword("")
    setTimeout(() => { setPasswordSaved(false); setShowPasswordForm(false) }, 2000)
  }

  function handleDelete() {
    setShowDeleteConfirm(false)
    alert("Usuário removido com sucesso! (Demonstração — nenhum dado real foi alterado)")
  }

  function addClient(clientId: string) {
    if (!assignedClients.includes(clientId)) {
      setAssignedClients((prev) => [...prev, clientId])
    }
  }

  function removeClient(clientId: string) {
    setAssignedClients((prev) => prev.filter((c) => c !== clientId))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
            <UserCircle className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={user.role === "admin" ? "default" : user.role === "member" ? "warning" : "secondary"}>
                <div className="flex items-center gap-1">
                  {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {roleLabels[user.role]}
                </div>
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <Key className="h-4 w-4" />
            Redefinir Senha
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4" />
            Excluir Usuário
          </Button>
        </div>
      </div>

      {showPasswordForm && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-3">Redefinir Senha</p>
          <div className="flex gap-3">
            <Input
              type="password"
              placeholder="Nova senha..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handlePasswordReset} disabled={!newPassword || passwordSaved}>
              {passwordSaved ? "Salvo!" : "Confirmar"}
            </Button>
            <Button variant="outline" onClick={() => setShowPasswordForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-800 mb-1">Confirmar exclusão</p>
          <p className="text-sm text-red-700 mb-3">Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-2">
            <Button variant="outline" className="text-red-600 border-red-300" onClick={handleDelete}>Sim, excluir</Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Editar Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Perfil</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="member">Membro</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? "Salvo!" : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {(role === "member" || user.role === "member") && (
            <Card>
              <CardHeader>
                <CardTitle>Clientes Atribuídos</CardTitle>
                <CardDescription>Clientes que este membro pode gerenciar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {assignedClients.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum cliente atribuído ainda</p>
                  ) : (
                    assignedClients.map((clientId) => {
                      const client = mockClients.find((c) => c.id === clientId)
                      if (!client) return null
                      return (
                        <div key={clientId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{client.company_name}</span>
                            <Badge variant={client.status === "ativo" ? "success" : "secondary"} className="text-xs">{client.status}</Badge>
                          </div>
                          <button
                            onClick={() => removeClient(clientId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 mb-2">Adicionar cliente:</p>
                  <div className="flex gap-2">
                    <Select onValueChange={addClient}>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Selecionar cliente..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClients
                          .filter((c) => !assignedClients.includes(c.id))
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {activityHistory.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3">
                    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      activity.type === "login" ? "bg-blue-500" :
                      activity.type === "action" ? "bg-emerald-500" :
                      activity.type === "report" ? "bg-purple-500" : "bg-amber-500"
                    }`} />
                    <div>
                      <p className="text-sm text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Cadastrado em</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(user.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Última atualização</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(user.updated_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Último acesso</p>
                <p className="text-sm font-medium text-gray-900">{user.last_login ? formatDate(user.last_login) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ID do usuário</p>
                <p className="text-xs text-gray-400 font-mono">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          {linkedClient && (
            <Card>
              <CardHeader>
                <CardTitle>Cliente Vinculado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{linkedClient.company_name}</p>
                    <p className="text-xs text-gray-500">{linkedClient.segment}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href={`/admin/clients/${linkedClient.id}`}>Ver Cliente</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
