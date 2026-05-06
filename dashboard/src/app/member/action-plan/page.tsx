"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, Circle, Eye, EyeOff, AlertTriangle, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockActionPlans, mockClients, mockUsers } from "@/lib/mock-data"
import { getPriorityColor, formatDate } from "@/lib/utils"
import type { ActionPlan, ActionStatus } from "@/lib/types"

const statusIcons = {
  pendente: <Circle className="h-4 w-4 text-gray-400" />,
  "em andamento": <Clock className="h-4 w-4 text-blue-500" />,
  concluído: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
}

const statusColors = {
  pendente: "bg-gray-100 text-gray-600",
  "em andamento": "bg-blue-100 text-blue-700",
  concluído: "bg-emerald-100 text-emerald-700",
}

export default function MemberActionPlanPage() {
  const [actions, setActions] = useState<ActionPlan[]>([])
  const [assignedClientIds, setAssignedClientIds] = useState<string[]>([])
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState("")
  const [publishedCount, setPublishedCount] = useState(0)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) return
    const user = JSON.parse(userData)
    const found = mockUsers.find((u) => u.email === user.email)
    const ids = found?.assigned_clients || []
    setAssignedClientIds(ids)
    const filtered = mockActionPlans.filter((a) => ids.includes(a.client_id))
    setActions(filtered)
    setPublishedCount(filtered.filter((a) => a.published_to_client).length)
  }, [])

  function toggleValidated(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, validated: !a.validated } : a))
    )
  }

  function togglePublished(id: string) {
    setActions((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, published_to_client: !a.published_to_client } : a))
      setPublishedCount(updated.filter((a) => a.published_to_client).length)
      return updated
    })
  }

  function changeStatus(id: string, status: ActionStatus) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  function startEditComment(action: ActionPlan) {
    setEditingComment(action.id)
    setCommentDraft(action.comments || "")
  }

  function saveComment(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, comments: commentDraft } : a))
    )
    setEditingComment(null)
    setCommentDraft("")
  }

  function publishAllValidated() {
    setActions((prev) => {
      const updated = prev.map((a) => (a.validated ? { ...a, published_to_client: true } : a))
      setPublishedCount(updated.filter((a) => a.published_to_client).length)
      return updated
    })
  }

  const clientsWithActions = assignedClientIds
    .map((id) => ({
      client: mockClients.find((c) => c.id === id),
      actions: actions.filter((a) => a.client_id === id),
    }))
    .filter((g) => g.client)

  const totalActions = actions.length
  const validatedCount = actions.filter((a) => a.validated).length

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos de Ação</h1>
          <p className="text-gray-500 mt-1">
            {validatedCount}/{totalActions} validadas · {publishedCount} publicadas para clientes
          </p>
        </div>
        <Button onClick={publishAllValidated} className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Publicar Todas Validadas
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-700">
          <strong>Atenção:</strong> O cliente só verá as ações publicadas. Revise e valide cada ação antes de publicar.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{actions.filter((a) => a.status === "pendente").length}</p>
          <p className="text-xs text-gray-500 mt-1">Pendentes</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{actions.filter((a) => a.status === "em andamento").length}</p>
          <p className="text-xs text-gray-500 mt-1">Em Andamento</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{actions.filter((a) => a.status === "concluído").length}</p>
          <p className="text-xs text-gray-500 mt-1">Concluídas</p>
        </div>
      </div>

      <div className="space-y-8">
        {clientsWithActions.map(({ client, actions: clientActions }) => (
          <div key={client!.id}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-gray-900">{client!.company_name}</h2>
              <Badge variant={client!.status === "ativo" ? "success" : "secondary"}>{client!.status}</Badge>
              <span className="text-sm text-gray-500">{clientActions.length} ações</span>
            </div>

            <div className="space-y-3">
              {clientActions.map((action) => (
                <Card key={action.id} className={`border ${action.published_to_client ? "border-emerald-200" : "border-gray-200"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{statusIcons[action.status]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${action.status === "concluído" ? "line-through text-gray-400" : "text-gray-900"}`}>
                            {action.action}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            {action.published_to_client ? (
                              <Badge variant="success" className="text-xs">Publicado</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Rascunho</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">{action.area}</Badge>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(action.priority)}`}>
                            {action.priority}
                          </span>
                          {action.responsible && (
                            <span className="text-xs text-gray-500">👤 {action.responsible}</span>
                          )}
                          {action.deadline && (
                            <span className="text-xs text-gray-500">📅 {formatDate(action.deadline)}</span>
                          )}
                        </div>

                        {action.comments && editingComment !== action.id && (
                          <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 italic">
                            💬 {action.comments}
                          </div>
                        )}

                        {editingComment === action.id && (
                          <div className="mt-2 space-y-2">
                            <textarea
                              className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              value={commentDraft}
                              onChange={(e) => setCommentDraft(e.target.value)}
                              placeholder="Adicione comentários ou notas sobre esta ação..."
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => saveComment(action.id)}>Salvar</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>Cancelar</Button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <select
                            value={action.status}
                            onChange={(e) => changeStatus(action.id, e.target.value as ActionStatus)}
                            className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColors[action.status]}`}
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em andamento">Em Andamento</option>
                            <option value="concluído">Concluído</option>
                          </select>

                          <Button
                            size="sm"
                            variant={action.validated ? "default" : "outline"}
                            className={`text-xs h-7 ${action.validated ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                            onClick={() => toggleValidated(action.id)}
                          >
                            {action.validated ? (
                              <><CheckCircle2 className="h-3 w-3" /> Validado</>
                            ) : (
                              "Validar"
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => startEditComment(action)}
                          >
                            {action.comments ? "Editar Nota" : "Adicionar Nota"}
                          </Button>

                          <Button
                            size="sm"
                            variant={action.published_to_client ? "outline" : "default"}
                            className="text-xs h-7"
                            onClick={() => togglePublished(action.id)}
                          >
                            {action.published_to_client ? (
                              <><EyeOff className="h-3 w-3" /> Despublicar</>
                            ) : (
                              <><Eye className="h-3 w-3" /> Publicar para Cliente</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {clientsWithActions.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Nenhum plano de ação encontrado</p>
            <p className="text-sm mt-1">Você não possui clientes atribuídos com planos de ação</p>
          </div>
        )}
      </div>
    </div>
  )
}
