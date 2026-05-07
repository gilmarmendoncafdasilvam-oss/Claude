"use client"

import { useState } from "react"
import Link from "next/link"
import { UserCircle, Plus, Search, Shield, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockUsers, mockClients } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

export default function UsersPage() {
  const [search, setSearch] = useState("")

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 mt-1">{mockUsers.length} usuários cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
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
              <span className="col-span-4">Usuário</span>
              <span className="col-span-2">Perfil</span>
              <span className="col-span-3">Cliente Vinculado</span>
              <span className="col-span-2">Último Acesso</span>
              <span className="col-span-1 text-right">Ações</span>
            </div>
            {filtered.map((user) => {
              const client = user.client_id ? mockClients.find((c) => c.id === user.client_id) : null
              return (
                <div key={user.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      <div className="flex items-center gap-1">
                        {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {user.role === "admin" ? "Admin" : "Cliente"}
                      </div>
                    </Badge>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600">{client?.company_name || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">{user.last_login ? formatDate(user.last_login) : "—"}</p>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/users/${user.id}`}>Editar</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
