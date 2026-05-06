"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as configurações da agência</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Agência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome da Agência</Label>
              <Input defaultValue="Agência TrafficDash" />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail de Contato</Label>
              <Input type="email" defaultValue="contato@agencia.com" />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp</Label>
              <Input defaultValue="+55 11 99999-9999" />
            </div>
            <Button>Salvar Informações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrações (Em breve)</CardTitle>
            <CardDescription>Conecte APIs para importação automática de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Google Ads API", status: "Não configurado", color: "bg-gray-100 text-gray-600" },
                { name: "Meta Ads API", status: "Não configurado", color: "bg-gray-100 text-gray-600" },
                { name: "Google Analytics 4", status: "Não configurado", color: "bg-gray-100 text-gray-600" },
                { name: "Google Search Console", status: "Não configurado", color: "bg-gray-100 text-gray-600" },
                { name: "CRM Integration", status: "Não configurado", color: "bg-gray-100 text-gray-600" },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <span className="font-medium text-sm text-gray-700">{integration.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${integration.color}`}>{integration.status}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">As integrações via API estarão disponíveis em breve. Por enquanto, use a importação manual via CSV.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
