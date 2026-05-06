"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const segments = [
  "Saúde / Clínica Médica", "Fitness / Academia", "Jurídico", "Imobiliário",
  "Educação / Cursos", "Estética / Beleza", "Odontologia", "Psicologia",
  "Consultoria", "E-commerce", "Restaurante / Food", "Outros",
]

const states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    company_name: "", trade_name: "", segment: "", website: "",
    instagram: "", main_objective: "", city: "", state: "", status: "ativo",
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSaved(true)
    setTimeout(() => router.push("/admin/clients"), 1000)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/clients"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-gray-500 mt-1">Preencha as informações do cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Informações da Empresa</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Razão Social *</Label>
                    <Input placeholder="Nome completo da empresa" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nome Fantasia</Label>
                    <Input placeholder="Como a empresa é conhecida" value={form.trade_name} onChange={(e) => update("trade_name", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Segmento</Label>
                  <Select value={form.segment} onValueChange={(v) => update("segment", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o segmento" /></SelectTrigger>
                    <SelectContent>
                      {segments.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <Input placeholder="https://site.com.br" value={form.website} onChange={(e) => update("website", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Instagram</Label>
                    <Input placeholder="@perfil" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Cidade</Label>
                    <Input placeholder="São Paulo" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estado</Label>
                    <Select value={form.state} onValueChange={(v) => update("state", v)}>
                      <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>
                        {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Objetivo Principal</Label>
                  <Textarea
                    placeholder="Ex: Gerar leads qualificados para consultas de estética..."
                    value={form.main_objective}
                    onChange={(e) => update("main_objective", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Status</CardTitle></CardHeader>
              <CardContent>
                <Select value={form.status} onValueChange={(v) => update("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full" disabled={loading || saved}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : saved ? "Salvo!" : <><Save className="h-4 w-4" />Salvar Cliente</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
