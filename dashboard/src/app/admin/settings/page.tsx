"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RefreshCw, Plus, Trash2, Eye, EyeOff, Shield, Bell, Globe, Key, Zap, Building2 } from "lucide-react"

const ALL_PERMISSIONS = [
  "Ver Clientes",
  "Adicionar Clientes",
  "Excluir Clientes",
  "Criar Relatórios",
  "Editar Relatórios",
  "Publicar Planos de Ação",
  "Importar Dados",
  "Acessar Configurações",
  "Gerenciar Integrações",
  "Gerenciar Usuários",
]

type RolePermissions = {
  [role: string]: { [perm: string]: boolean }
}

const defaultRolePermissions: RolePermissions = {
  Gestor: Object.fromEntries(ALL_PERMISSIONS.map((p) => [p, true])),
  Analista: Object.fromEntries(
    ALL_PERMISSIONS.map((p) => [
      p,
      ["Ver Clientes", "Adicionar Clientes", "Criar Relatórios", "Editar Relatórios", "Publicar Planos de Ação", "Importar Dados"].includes(p),
    ])
  ),
  Funcionário: Object.fromEntries(
    ALL_PERMISSIONS.map((p) => [
      p,
      ["Ver Clientes", "Criar Relatórios", "Importar Dados"].includes(p),
    ])
  ),
  Visualizador: Object.fromEntries(
    ALL_PERMISSIONS.map((p) => [p, ["Ver Clientes"].includes(p)])
  ),
}

const mockSessions = [
  { browser: "Chrome 124 — macOS", ip: "189.124.45.12", lastAccess: "Hoje, 14:32", id: 1 },
  { browser: "Safari — iPhone 15", ip: "189.124.45.13", lastAccess: "Hoje, 11:05", id: 2 },
  { browser: "Firefox 125 — Windows", ip: "200.99.12.50", lastAccess: "Ontem, 18:44", id: 3 },
]

const mockLogs = [
  { timestamp: "06/05/2026 14:32", user: "admin@agencia.com", action: "Login realizado", ip: "189.124.45.12" },
  { timestamp: "06/05/2026 12:10", user: "admin@agencia.com", action: "Configurações salvas", ip: "189.124.45.12" },
  { timestamp: "06/05/2026 10:55", user: "joao@agencia.com", action: "Relatório exportado", ip: "200.10.33.77" },
  { timestamp: "05/05/2026 17:22", user: "admin@agencia.com", action: "Usuário criado", ip: "189.124.45.12" },
  { timestamp: "05/05/2026 09:01", user: "maria@agencia.com", action: "Login realizado", ip: "177.55.88.22" },
]

type Webhook = { url: string; evento: string; secret: string; id: number }

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const [agencia, setAgencia] = useState({
    nome: "Agência TrafficDash",
    cnpj: "12.345.678/0001-90",
    email: "contato@agencia.com",
    whatsapp: "+55 11 99999-9999",
    site: "https://agencia.com.br",
    endereco: "Av. Paulista, 1000 — São Paulo, SP",
  })

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(defaultRolePermissions)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)

  const togglePerm = (role: string, perm: string) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] },
    }))
  }

  const notifications = [
    { key: "newLead", label: "Novo lead gerado", desc: "Notifica quando um novo lead é captado em qualquer canal" },
    { key: "roas", label: "Meta de ROAS atingida", desc: "Alerta quando a meta de ROAS configurada for alcançada" },
    { key: "report", label: "Relatório gerado", desc: "Avisa quando um novo relatório estiver disponível" },
    { key: "actionPlan", label: "Plano de ação publicado", desc: "Notifica quando um plano de ação for publicado para o cliente" },
    { key: "integError", label: "Erro de integração", desc: "Alerta imediato quando alguma integração falhar" },
    { key: "newUser", label: "Novo funcionário cadastrado", desc: "Notifica quando um novo membro for adicionado à equipe" },
  ]
  const [notifState, setNotifState] = useState<Record<string, boolean>>({
    newLead: true, roas: true, report: true, actionPlan: false, integError: true, newUser: false,
  })

  const [sessions, setSessions] = useState(mockSessions)

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })
  const [showPw, setShowPw] = useState(false)

  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [showWHForm, setShowWHForm] = useState(false)
  const [whForm, setWhForm] = useState({ url: "", evento: "client.created", secret: "" })

  const addWebhook = () => {
    if (!whForm.url) return
    setWebhooks((prev) => [...prev, { ...whForm, id: Date.now() }])
    setWhForm({ url: "", evento: "client.created", secret: "" })
    setShowWHForm(false)
  }

  const [prefs, setPrefs] = useState({
    theme: "sistema",
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    moeda: "BRL",
    dateFormat: "DD/MM/AAAA",
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as configurações da plataforma</p>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          Configurações salvas com sucesso.
        </div>
      )}

      <Tabs defaultValue="agencia">
        <TabsList className="mb-6">
          <TabsTrigger value="agencia">Agência</TabsTrigger>
          <TabsTrigger value="cargos">Cargos & Permissões</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="api">API & Webhooks</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="mcp">MCP & IA</TabsTrigger>
        </TabsList>

        <TabsContent value="agencia">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Agência
              </CardTitle>
              <CardDescription>Dados institucionais exibidos em relatórios e comunicações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome da Agência</Label>
                  <Input value={agencia.nome} onChange={(e) => setAgencia({ ...agencia, nome: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>CNPJ</Label>
                  <Input value={agencia.cnpj} onChange={(e) => setAgencia({ ...agencia, cnpj: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input type="email" value={agencia.email} onChange={(e) => setAgencia({ ...agencia, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <Input value={agencia.whatsapp} onChange={(e) => setAgencia({ ...agencia, whatsapp: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Site</Label>
                <Input value={agencia.site} onChange={(e) => setAgencia({ ...agencia, site: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Endereço</Label>
                <Input value={agencia.endereco} onChange={(e) => setAgencia({ ...agencia, endereco: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Logo da Agência</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-400">Clique para fazer upload ou arraste uma imagem</p>
                  <p className="text-xs text-gray-300 mt-1">PNG, JPG até 2MB</p>
                  <Button variant="outline" size="sm" className="mt-3">Selecionar arquivo</Button>
                </div>
              </div>
              <Button onClick={showSaved}>Salvar Informações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cargos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cargos & Permissões
              </CardTitle>
              <CardDescription>Defina o que cada cargo pode acessar e executar na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(rolePermissions).map(([role, perms]) => {
                  const activePerms = ALL_PERMISSIONS.filter((p) => perms[p])
                  const isExpanded = expandedRole === role
                  return (
                    <div key={role} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-sm text-gray-800 w-28">{role}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activePerms.slice(0, 4).map((p) => (
                              <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                            ))}
                            {activePerms.length > 4 && (
                              <Badge variant="secondary" className="text-xs">+{activePerms.length - 4} mais</Badge>
                            )}
                            {activePerms.length === 0 && (
                              <span className="text-xs text-gray-400">Nenhuma permissão</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedRole(isExpanded ? null : role)}
                        >
                          {isExpanded ? "Fechar" : "Editar"}
                        </Button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Permissões do cargo</p>
                          <div className="grid grid-cols-2 gap-2">
                            {ALL_PERMISSIONS.map((perm) => (
                              <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!perms[perm]}
                                  onChange={() => togglePerm(role, perm)}
                                  className="rounded border-gray-300 text-blue-600 h-4 w-4"
                                />
                                <span className="text-sm text-gray-700">{perm}</span>
                              </label>
                            ))}
                          </div>
                          <Button size="sm" className="mt-4" onClick={showSaved}>Salvar Cargo</Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Escolha quais eventos geram notificações para você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {notifications.map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{n.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifState((s) => ({ ...s, [n.key]: !s[n.key] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifState[n.key] ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        notifState[n.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={showSaved}>Salvar Preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <div className="space-y-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Sessões Ativas
                </CardTitle>
                <CardDescription>Dispositivos com sessão aberta na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                        <th className="pb-2 font-medium">Navegador / Dispositivo</th>
                        <th className="pb-2 font-medium">IP</th>
                        <th className="pb-2 font-medium">Último acesso</th>
                        <th className="pb-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s) => (
                        <tr key={s.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 text-gray-700">{s.browser}</td>
                          <td className="py-3 text-gray-500 font-mono text-xs">{s.ip}</td>
                          <td className="py-3 text-gray-500">{s.lastAccess}</td>
                          <td className="py-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:border-red-200"
                              onClick={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))}
                            >
                              Encerrar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logs de Acesso</CardTitle>
                <CardDescription>Histórico recente de acessos e ações na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400 font-mono">{log.timestamp}</span>
                          <span className="text-xs text-gray-500">{log.user}</span>
                        </div>
                        <p className="text-sm text-gray-700">{log.action}</p>
                      </div>
                      <span className="text-xs text-gray-400 font-mono flex-shrink-0">{log.ip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Redefinir Senha Mestra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Senha atual</Label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      value={pwForm.current}
                      onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Nova senha</Label>
                  <Input
                    type="password"
                    value={pwForm.next}
                    onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirmar nova senha</Label>
                  <Input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Button onClick={showSaved}>Alterar Senha</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="space-y-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Chave de API
                </CardTitle>
                <CardDescription>Use esta chave para autenticar requisições à API do TrafficDash</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm text-gray-700">
                    {apiKeyVisible ? "sk-live-a1b2c3d4e5f6g7h8i9j0k1l2m3n4" : "sk-live-••••••••••••••••••••••••••••"}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                    {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText("sk-live-a1b2c3d4e5f6g7h8i9j0k1l2m3n4")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={showSaved}>
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Regenerar
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Nunca compartilhe sua chave de API. Regenerar invalida a chave atual.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Webhooks
                    </CardTitle>
                    <CardDescription className="mt-1">Receba notificações em tempo real para eventos da plataforma</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowWHForm(!showWHForm)}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Adicionar Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showWHForm && (
                  <div className="border border-blue-100 bg-blue-50 rounded-lg p-4 mb-4 space-y-3">
                    <p className="text-sm font-medium text-blue-800">Novo Webhook</p>
                    <div className="space-y-1.5">
                      <Label>URL de destino</Label>
                      <Input
                        placeholder="https://seu-servidor.com/webhook"
                        value={whForm.url}
                        onChange={(e) => setWhForm({ ...whForm, url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Evento</Label>
                      <select
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                        value={whForm.evento}
                        onChange={(e) => setWhForm({ ...whForm, evento: e.target.value })}
                      >
                        <option value="client.created">client.created</option>
                        <option value="report.generated">report.generated</option>
                        <option value="lead.created">lead.created</option>
                        <option value="integration.error">integration.error</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Secret</Label>
                      <Input
                        placeholder="chave-secreta-opcional"
                        value={whForm.secret}
                        onChange={(e) => setWhForm({ ...whForm, secret: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addWebhook}>Salvar</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowWHForm(false)}>Cancelar</Button>
                    </div>
                  </div>
                )}

                {webhooks.length === 0 && !showWHForm && (
                  <div className="text-center py-8 text-gray-400">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum webhook configurado</p>
                    <p className="text-xs mt-1">Adicione um webhook para receber eventos em tempo real</p>
                  </div>
                )}

                {webhooks.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                          <th className="pb-2 font-medium">URL</th>
                          <th className="pb-2 font-medium">Evento</th>
                          <th className="pb-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {webhooks.map((wh) => (
                          <tr key={wh.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 font-mono text-xs text-gray-600 max-w-xs truncate">{wh.url}</td>
                            <td className="py-3">
                              <Badge variant="secondary" className="text-xs">{wh.evento}</Badge>
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setWebhooks((prev) => prev.filter((x) => x.id !== wh.id))}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferencias">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferências
              </CardTitle>
              <CardDescription>Personalize a aparência e comportamento da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex gap-3">
                  {["claro", "escuro", "sistema"].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={t}
                        checked={prefs.theme === t}
                        onChange={() => setPrefs({ ...prefs, theme: t })}
                        className="accent-blue-600"
                      />
                      <span className="text-sm capitalize text-gray-700">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Idioma</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={prefs.idioma}
                  onChange={(e) => setPrefs({ ...prefs, idioma: e.target.value })}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Fuso horário</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={prefs.timezone}
                  onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                >
                  <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Formato de moeda</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={prefs.moeda}
                  onChange={(e) => setPrefs({ ...prefs, moeda: e.target.value })}
                >
                  <option value="BRL">BRL — Real Brasileiro (R$)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Formato de data padrão</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                  value={prefs.dateFormat}
                  onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })}
                >
                  <option value="DD/MM/AAAA">DD/MM/AAAA</option>
                  <option value="MM/DD/AAAA">MM/DD/AAAA</option>
                  <option value="AAAA-MM-DD">AAAA-MM-DD</option>
                </select>
              </div>

              <Button onClick={showSaved}>Salvar Preferências</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mcp">
          <Card>
            <CardHeader>
              <CardTitle>MCP — Model Context Protocol</CardTitle>
              <CardDescription>Conecte assistentes de IA para automatizar análises e relatórios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-purple-800 mb-1">🤖 Integração com IA</p>
                <p className="text-sm text-purple-700">Com MCP, assistentes de IA podem acessar dados da plataforma, gerar relatórios automaticamente e detectar anomalias em tempo real.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>URL do Servidor MCP</Label>
                  <Input placeholder="https://mcp.sua-agencia.com" disabled />
                  <p className="text-xs text-gray-400">Endpoint do seu servidor MCP compatível com o protocolo Anthropic.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Token de Autenticação</Label>
                  <Input type="password" placeholder="mcp_token_••••••••" disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Modelo Padrão de IA</Label>
                  <select disabled className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">
                    <option>Claude Sonnet (Anthropic)</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Automações disponíveis via IA</p>
                <div className="space-y-2">
                  {[
                    { label: "Gerar diagnóstico automaticamente", desc: "IA analisa métricas e gera diagnóstico estratégico" },
                    { label: "Sugerir plano de ação", desc: "Baseado nos dados do período, sugere ações prioritárias" },
                    { label: "Detectar anomalias", desc: "Alerta quando métricas fogem do padrão histórico" },
                    { label: "Relatório narrativo", desc: "Gera texto explicativo para o relatório do cliente" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full shrink-0 ml-3">Em breve</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button disabled>Salvar Configuração MCP</Button>
                <Button variant="outline" disabled>Testar Conexão</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
