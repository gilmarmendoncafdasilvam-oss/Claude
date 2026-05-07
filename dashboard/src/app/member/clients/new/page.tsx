"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePermissions } from "@/hooks/use-permissions"
import { AccessDenied } from "@/components/ui/access-denied"

export default function MemberNewClientPage() {
  const router = useRouter()
  const { can, loaded } = usePermissions()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    company_name: "",
    trade_name: "",
    segment: "",
    city: "",
    state: "",
    website: "",
    instagram: "",
    main_objective: "",
    responsible_name: "",
    responsible_email: "",
    responsible_phone: "",
  })

  if (!loaded) return <div className="p-8 text-gray-400 text-sm">Carregando...</div>
  if (!can("clients.create")) return <AccessDenied message="Você não tem permissão para cadastrar novos clientes. Solicite ao administrador." />

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => router.push("/member/clients"), 1500)
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Cliente cadastrado!</h3>
        <p className="text-sm text-gray-500">Redirecionando para a lista de clientes...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/member/clients"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Preencha os dados para cadastrar um novo cliente</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-sm text-blue-700">
        O administrador será notificado sobre este novo cadastro. O cliente ficará vinculado à sua carteira.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="company_name">Razão Social *</Label>
                <Input id="company_name" name="company_name" required value={form.company_name} onChange={handleChange} placeholder="Nome oficial da empresa" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="trade_name">Nome Fantasia</Label>
                <Input id="trade_name" name="trade_name" value={form.trade_name} onChange={handleChange} placeholder="Como é conhecido" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="segment">Segmento *</Label>
                <Input id="segment" name="segment" required value={form.segment} onChange={handleChange} placeholder="Ex: Saúde, Jurídico, Fitness" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Site</Label>
                <Input id="website" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" name="city" value={form.city} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="SP" maxLength={2} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@perfil" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="main_objective">Objetivo Principal *</Label>
              <Input id="main_objective" name="main_objective" required value={form.main_objective} onChange={handleChange} placeholder="Ex: Gerar leads para consultas" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Responsável pelo Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="responsible_name">Nome *</Label>
                <Input id="responsible_name" name="responsible_name" required value={form.responsible_name} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="responsible_email">E-mail *</Label>
                <Input id="responsible_email" name="responsible_email" type="email" required value={form.responsible_email} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="responsible_phone">WhatsApp</Label>
              <Input id="responsible_phone" name="responsible_phone" value={form.responsible_phone} onChange={handleChange} placeholder="(11) 99999-9999" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Cadastrar Cliente"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/member/clients">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
