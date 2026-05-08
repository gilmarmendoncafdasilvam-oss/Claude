import type { LeadStatus, LeadQualification, LossReason } from "./types"

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em Atendimento",
  qualificado: "Qualificado",
  proposta_enviada: "Proposta Enviada",
  venda_realizada: "Venda Realizada",
  perdido: "Perdido",
  desqualificado: "Desqualificado",
  sem_resposta: "Sem Resposta",
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  novo: "bg-blue-100 text-blue-700",
  em_atendimento: "bg-yellow-100 text-yellow-700",
  qualificado: "bg-emerald-100 text-emerald-700",
  proposta_enviada: "bg-purple-100 text-purple-700",
  venda_realizada: "bg-green-100 text-green-700 font-semibold",
  perdido: "bg-red-100 text-red-700",
  desqualificado: "bg-gray-100 text-gray-600",
  sem_resposta: "bg-orange-100 text-orange-700",
}

export const LEAD_STATUS_KANBAN: LeadStatus[] = [
  "novo",
  "em_atendimento",
  "qualificado",
  "proposta_enviada",
  "venda_realizada",
  "perdido",
]

export const QUALIFICATION_LABELS: Record<LeadQualification, string> = {
  muito_qualificado: "Muito qualificado",
  qualificado: "Qualificado",
  pouco_qualificado: "Pouco qualificado",
  desqualificado: "Desqualificado",
}

export const QUALIFICATION_COLORS: Record<LeadQualification, string> = {
  muito_qualificado: "bg-emerald-100 text-emerald-700",
  qualificado: "bg-blue-100 text-blue-700",
  pouco_qualificado: "bg-yellow-100 text-yellow-700",
  desqualificado: "bg-red-100 text-red-600",
}

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  preco_alto: "Preço alto",
  nao_respondeu: "Não respondeu",
  fora_da_regiao: "Fora da região",
  sem_orcamento: "Sem orçamento",
  comprou_concorrente: "Comprou com concorrente",
  nao_era_perfil: "Não era o perfil ideal",
  lead_duplicado: "Lead duplicado",
  atendimento_demorou: "Atendimento demorou",
  sem_interesse_real: "Sem interesse real",
  outro: "Outro",
}

export const LEAD_ORIGINS = [
  "Meta Ads",
  "Google Ads",
  "Instagram",
  "WhatsApp",
  "Site",
  "Indicação",
  "TikTok",
  "YouTube",
  "Outro",
]
