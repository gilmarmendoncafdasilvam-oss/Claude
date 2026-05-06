"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Zap, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { MetricCard } from "@/components/dashboard/metric-card"

type IntegrationStatus = "ativo" | "nao_configurado" | "em_breve"

interface Integration {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  lastSync: string
  color: string
  initial: string
}

const integrations: Integration[] = [
  {
    id: "google_ads",
    name: "Google Ads API",
    description: "Importação automática de dados de campanhas",
    status: "nao_configurado",
    lastSync: "Nunca sincronizado",
    color: "bg-blue-500",
    initial: "G",
  },
  {
    id: "meta_ads",
    name: "Meta Ads API",
    description: "Importação automática de anúncios e métricas",
    status: "nao_configurado",
    lastSync: "Nunca sincronizado",
    color: "bg-blue-700",
    initial: "M",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    description: "Dados de tráfego e comportamento do site",
    status: "nao_configurado",
    lastSync: "Nunca sincronizado",
    color: "bg-orange-500",
    initial: "A",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "Métricas de atendimento e conversas",
    status: "nao_configurado",
    lastSync: "Nunca sincronizado",
    color: "bg-green-500",
    initial: "W",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    description: "Importação automática de planilhas",
    status: "nao_configurado",
    lastSync: "Nunca sincronizado",
    color: "bg-emerald-600",
    initial: "S",
  },
  {
    id: "rd_station",
    name: "RD Station CRM",
    description: "Leads e dados comerciais",
    status: "em_breve",
    lastSync: "—",
    color: "bg-purple-500",
    initial: "R",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    description: "CRM e pipeline de vendas",
    status: "em_breve",
    lastSync: "—",
    color: "bg-orange-600",
    initial: "H",
  },
  {
    id: "make_zapier",
    name: "Make / Zapier",
    description: "Automações via webhook",
    status: "nao_configurado",
    lastSync: "Nunca sincronizado",
    color: "bg-violet-500",
    initial: "Z",
  },
]

type TestState = "idle" | "loading" | "error"

type FormData = Record<string, string>

function statusBadge(status: IntegrationStatus) {
  if (status === "ativo") return <Badge className="bg-green-100 text-green-700 border-green-200">Ativo</Badge>
  if (status === "em_breve") return <Badge className="bg-gray-100 text-gray-500 border-gray-200">Em breve</Badge>
  return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Não configurado</Badge>
}

function GoogleAdsForm({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  const [form, setForm] = useState<FormData>({ developerToken: "", clientId: "", clientSecret: "", refreshToken: "" })
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Developer Token</Label>
          <Input placeholder="ABcDeFgH..." value={form.developerToken} onChange={(e) => setForm({ ...form, developerToken: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Client ID</Label>
          <Input placeholder="123456789.apps.googleusercontent.com" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Client Secret</Label>
          <Input type="password" placeholder="••••••••" value={form.clientSecret} onChange={(e) => setForm({ ...form, clientSecret: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Refresh Token</Label>
          <Input type="password" placeholder="••••••••" value={form.refreshToken} onChange={(e) => setForm({ ...form, refreshToken: e.target.value })} />
        </div>
      </div>
      <TestButton onTest={onTest} testState={testState} />
    </div>
  )
}

function MetaAdsForm({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  const [form, setForm] = useState<FormData>({ accessToken: "", adAccountId: "" })
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Access Token</Label>
          <Input type="password" placeholder="EAABs..." value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Ad Account ID</Label>
          <Input placeholder="act_123456789" value={form.adAccountId} onChange={(e) => setForm({ ...form, adAccountId: e.target.value })} />
        </div>
      </div>
      <TestButton onTest={onTest} testState={testState} />
    </div>
  )
}

function GA4Form({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  const [form, setForm] = useState<FormData>({ propertyId: "", serviceAccount: "" })
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Property ID</Label>
        <Input placeholder="123456789" value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Service Account JSON</Label>
        <textarea
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-mono bg-white min-h-[100px] resize-none"
          placeholder='{"type": "service_account", ...}'
          value={form.serviceAccount}
          onChange={(e) => setForm({ ...form, serviceAccount: e.target.value })}
        />
      </div>
      <TestButton onTest={onTest} testState={testState} />
    </div>
  )
}

function WhatsAppForm({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  const [form, setForm] = useState<FormData>({ phoneNumberId: "", accessToken: "", webhookVerifyToken: "" })
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Phone Number ID</Label>
          <Input placeholder="123456789012345" value={form.phoneNumberId} onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Access Token</Label>
          <Input type="password" placeholder="EAABs..." value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Webhook Verify Token</Label>
          <Input placeholder="meu-token-secreto" value={form.webhookVerifyToken} onChange={(e) => setForm({ ...form, webhookVerifyToken: e.target.value })} />
        </div>
      </div>
      <TestButton onTest={onTest} testState={testState} />
    </div>
  )
}

function SheetsForm({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  const [form, setForm] = useState<FormData>({ sheetUrl: "", tab: "", range: "A1:Z100", frequency: "dia" })
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>URL da Planilha</Label>
        <Input placeholder="https://docs.google.com/spreadsheets/d/..." value={form.sheetUrl} onChange={(e) => setForm({ ...form, sheetUrl: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Aba / Tab</Label>
          <Input placeholder="Sheet1" value={form.tab} onChange={(e) => setForm({ ...form, tab: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Intervalo</Label>
          <Input placeholder="A1:Z100" value={form.range} onChange={(e) => setForm({ ...form, range: e.target.value })} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Frequência de Sincronização</Label>
          <select
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          >
            <option value="hora">A cada hora</option>
            <option value="dia">Uma vez por dia</option>
            <option value="semana">Uma vez por semana</option>
          </select>
        </div>
      </div>
      <TestButton onTest={onTest} testState={testState} />
    </div>
  )
}

function MakeZapierForm({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  const [form, setForm] = useState<FormData>({ webhookUrl: "", secretKey: "" })
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Webhook URL</Label>
        <Input placeholder="https://hook.make.com/..." value={form.webhookUrl} onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Secret Key</Label>
        <Input type="password" placeholder="••••••••" value={form.secretKey} onChange={(e) => setForm({ ...form, secretKey: e.target.value })} />
      </div>
      <TestButton onTest={onTest} testState={testState} />
    </div>
  )
}

function TestButton({ onTest, testState }: { onTest: () => void; testState: TestState }) {
  return (
    <div className="flex items-center gap-3">
      <Button size="sm" variant="outline" onClick={onTest} disabled={testState === "loading"}>
        {testState === "loading" ? (
          <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Testando...</>
        ) : (
          "Testar Conexão"
        )}
      </Button>
      {testState === "error" && (
        <span className="flex items-center gap-1.5 text-sm text-red-600">
          <XCircle className="h-4 w-4" />
          Credenciais inválidas
        </span>
      )}
      {testState === "idle" && null}
    </div>
  )
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const [expanded, setExpanded] = useState(false)
  const [testState, setTestState] = useState<TestState>("idle")

  const handleTest = () => {
    setTestState("loading")
    setTimeout(() => setTestState("error"), 1500)
  }

  const canConfigure = integration.status !== "em_breve"

  function renderForm() {
    if (integration.id === "google_ads") return <GoogleAdsForm onTest={handleTest} testState={testState} />
    if (integration.id === "meta_ads") return <MetaAdsForm onTest={handleTest} testState={testState} />
    if (integration.id === "ga4") return <GA4Form onTest={handleTest} testState={testState} />
    if (integration.id === "whatsapp") return <WhatsAppForm onTest={handleTest} testState={testState} />
    if (integration.id === "sheets") return <SheetsForm onTest={handleTest} testState={testState} />
    if (integration.id === "make_zapier") return <MakeZapierForm onTest={handleTest} testState={testState} />
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`h-10 w-10 rounded-lg ${integration.color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-sm">{integration.initial}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{integration.name}</p>
                {statusBadge(integration.status)}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{integration.description}</p>
              <p className="text-xs text-gray-400 mt-1">{integration.lastSync}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {canConfigure ? (
              <Button
                size="sm"
                variant={expanded ? "default" : "outline"}
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5"
              >
                {expanded ? "Fechar" : integration.status === "ativo" ? "Configurar" : "Conectar"}
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled className="text-gray-400">Em breve</Button>
            )}
          </div>
        </div>

        {expanded && canConfigure && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {renderForm()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function IntegrationsPage() {
  const [copied, setCopied] = useState(false)

  const webhookUrl = "https://seu-dominio/api/webhook/import"

  const handleCopy = () => {
    navigator.clipboard?.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
        <p className="text-gray-500 mt-1">Conecte suas ferramentas e automatize o fluxo de dados</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard title="Integrações Ativas" value="1" description="CSV configurado" />
        <MetricCard title="Sincronizações Hoje" value="3" description="última há 2h" />
        <MetricCard title="Último Erro" value="Nenhum" description="sistema estável" />
      </div>

      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Conexões disponíveis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Webhooks de Entrada
          </CardTitle>
          <CardDescription>Use este webhook para receber dados automaticamente de ferramentas externas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Nome</th>
                  <th className="pb-2 font-medium">URL do Webhook</th>
                  <th className="pb-2 font-medium">Último disparo</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="py-3 text-gray-700 font-medium">Import Automático</td>
                  <td className="py-3 font-mono text-xs text-gray-500">{webhookUrl}</td>
                  <td className="py-3 text-gray-400">Nunca</td>
                  <td className="py-3">
                    <Badge className="bg-gray-100 text-gray-500 border-gray-200">Inativo</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1.5">
                      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copiado!" : "Copiar URL"}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
