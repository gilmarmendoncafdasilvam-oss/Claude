"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Plus, Search, ExternalLink, Edit, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockClients } from "@/lib/mock-data"

export default function ClientsPage() {
  const [search, setSearch] = useState("")

  const filtered = mockClients.filter(
    (c) =>
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.segment?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">{mockClients.length} clientes cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, segmento ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <div className="divide-y divide-gray-100 min-w-[640px]">
            <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              <span className="col-span-4">Empresa</span>
              <span className="col-span-3">Segmento</span>
              <span className="col-span-2">Cidade / Estado</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-2 text-right">Ações</span>
            </div>
            {filtered.map((client) => (
              <div key={client.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{client.company_name}</p>
                    {client.trade_name && <p className="text-xs text-gray-500">{client.trade_name}</p>}
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-600">{client.segment || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">
                    {client.city && client.state ? `${client.city}, ${client.state}` : "—"}
                  </p>
                </div>
                <div className="col-span-1">
                  <Badge
                    variant={
                      client.status === "ativo" ? "success" : client.status === "inativo" ? "secondary" : "warning"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/clients/${client.id}`} title="Editar">
                      <Edit className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/reports?client=${client.id}`} title="Ver relatórios">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
