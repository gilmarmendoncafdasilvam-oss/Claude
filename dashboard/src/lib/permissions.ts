export type MemberPermission =
  | "clients.view"
  | "clients.create"
  | "clients.edit"
  | "clients.delete"
  | "reports.view"
  | "reports.create"
  | "reports.edit"
  | "reports.delete"
  | "action_plans.view"
  | "action_plans.edit"
  | "action_plans.publish"
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "integrations.view"
  | "integrations.manage"
  | "settings.view"
  | "settings.edit"
  | "data.import"
  | "data.export"

export type MemberRole = "gestor" | "analista" | "funcionario" | "visualizador"

export const ROLE_PERMISSIONS: Record<MemberRole, MemberPermission[]> = {
  gestor: [
    "clients.view", "clients.create", "clients.edit",
    "reports.view", "reports.create", "reports.edit",
    "action_plans.view", "action_plans.edit", "action_plans.publish",
    "users.view", "users.create",
    "integrations.view",
    "settings.view",
    "data.import", "data.export",
  ],
  analista: [
    "clients.view",
    "reports.view", "reports.create", "reports.edit",
    "action_plans.view", "action_plans.edit",
    "settings.view",
    "data.import", "data.export",
  ],
  funcionario: [
    "clients.view",
    "reports.view",
    "action_plans.view", "action_plans.edit",
    "data.import",
  ],
  visualizador: [
    "clients.view",
    "reports.view",
    "action_plans.view",
  ],
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  gestor: "Gestor",
  analista: "Analista",
  funcionario: "Funcionário",
  visualizador: "Visualizador",
}

export const PERMISSION_LABELS: Record<MemberPermission, string> = {
  "clients.view": "Ver clientes",
  "clients.create": "Adicionar clientes",
  "clients.edit": "Editar clientes",
  "clients.delete": "Excluir clientes",
  "reports.view": "Ver relatórios",
  "reports.create": "Criar relatórios",
  "reports.edit": "Editar relatórios",
  "reports.delete": "Excluir relatórios",
  "action_plans.view": "Ver planos de ação",
  "action_plans.edit": "Editar planos de ação",
  "action_plans.publish": "Publicar planos de ação",
  "users.view": "Ver usuários",
  "users.create": "Criar usuários",
  "users.edit": "Editar usuários",
  "users.delete": "Excluir usuários",
  "integrations.view": "Ver integrações",
  "integrations.manage": "Gerenciar integrações",
  "settings.view": "Ver configurações",
  "settings.edit": "Editar configurações",
  "data.import": "Importar dados",
  "data.export": "Exportar dados",
}

export function hasPermission(
  userPermissions: MemberPermission[],
  permission: MemberPermission
): boolean {
  return userPermissions.includes(permission)
}
