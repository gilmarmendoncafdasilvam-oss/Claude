export type UserRole = "admin" | "client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  client_id?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface Client {
  id: string
  company_name: string
  trade_name?: string
  segment?: string
  website?: string
  instagram?: string
  main_objective?: string
  city?: string
  state?: string
  status: "ativo" | "inativo" | "pausado"
  created_at: string
  updated_at: string
}

export type ReportType = "semanal" | "mensal" | "trimestral" | "personalizado"

export interface Report {
  id: string
  client_id: string
  report_type: ReportType
  period_start: string
  period_end: string
  title: string
  executive_summary?: string
  main_highlight?: string
  main_warning?: string
  next_steps?: string
  created_by: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface PaidMediaMetrics {
  id: string
  report_id: string
  client_id: string
  channel: string
  campaign_name?: string
  ad_group_name?: string
  ad_name?: string
  objective?: string
  spend: number
  impressions: number
  reach?: number
  frequency?: number
  clicks: number
  link_clicks?: number
  ctr: number
  cpc: number
  cpm: number
  leads: number
  conversions: number
  conversion_rate: number
  cpl: number
  cpa: number
  revenue?: number
  roas?: number
  created_at: string
}

export interface GoogleAdsMetrics {
  id: string
  report_id: string
  client_id: string
  campaign_name: string
  ad_group_name?: string
  keyword?: string
  search_term?: string
  match_type?: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  cost_per_conversion: number
  conversion_rate: number
  impression_share?: number
  top_impression_share?: number
  absolute_top_impression_share?: number
  lost_is_budget?: number
  lost_is_rank?: number
  quality_score?: number
  status?: string
  recommendation?: string
}

export interface MetaAdsMetrics {
  id: string
  report_id: string
  client_id: string
  campaign_name: string
  ad_set_name?: string
  ad_name?: string
  creative_name?: string
  audience?: string
  placement?: string
  objective?: string
  spend: number
  reach: number
  impressions: number
  frequency: number
  cpm: number
  clicks: number
  link_clicks?: number
  ctr: number
  cpc: number
  leads: number
  conversations?: number
  cost_per_lead: number
  cost_per_conversation?: number
  landing_page_views?: number
  profile_visits?: number
  engagements?: number
  video_views?: number
  hook_rate?: number
  hold_rate?: number
  thumbstop_rate?: number
  status?: string
  recommendation?: string
}

export interface GA4Metrics {
  id: string
  report_id: string
  client_id: string
  sessions: number
  users: number
  new_users: number
  pageviews: number
  engaged_sessions: number
  engagement_rate: number
  average_engagement_time: number
  bounce_rate: number
  key_events?: number
  conversions: number
  conversion_rate: number
  source?: string
  medium?: string
  campaign?: string
  device?: string
  landing_page?: string
  exit_page?: string
  whatsapp_clicks?: number
  form_submits?: number
  button_clicks?: number
}

export interface WhatsappMetrics {
  id: string
  report_id: string
  client_id: string
  conversations_started: number
  messages_received?: number
  leads_answered: number
  leads_not_answered: number
  average_response_time?: number
  response_rate: number
  qualified_leads: number
  unqualified_leads: number
  scheduled_appointments: number
  show_ups: number
  no_shows: number
  proposals_sent: number
  sales: number
  close_rate: number
  cost_per_conversation?: number
  cost_per_appointment?: number
  cost_per_sale?: number
  lost_reasons?: string
}

export interface FunnelMetrics {
  id: string
  report_id: string
  client_id: string
  impressions: number
  clicks: number
  site_visits: number
  landing_page_views: number
  leads: number
  whatsapp_conversations: number
  qualified_leads: number
  appointments: number
  show_ups: number
  proposals: number
  sales: number
  revenue: number
  click_through_rate: number
  page_conversion_rate: number
  lead_to_appointment_rate: number
  appointment_to_sale_rate: number
  overall_conversion_rate: number
  main_bottleneck?: string
}

export interface FinancialMetrics {
  id: string
  report_id: string
  client_id: string
  media_spend: number
  management_fee: number
  total_marketing_cost: number
  revenue?: number
  gross_profit?: number
  average_ticket?: number
  sales_count?: number
  cac?: number
  roas?: number
  roi?: number
  break_even_revenue?: number
  ltv?: number
  payback?: number
  margin?: number
}

export type PerformanceStatus = "excelente" | "bom" | "estável" | "atenção" | "crítico"

export interface Diagnostic {
  id: string
  report_id: string
  client_id: string
  performance_status: PerformanceStatus
  what_improved?: string
  what_worsened?: string
  main_problem?: string
  main_opportunity?: string
  traffic_diagnosis?: string
  offer_diagnosis?: string
  landing_page_diagnosis?: string
  commercial_diagnosis?: string
  financial_diagnosis?: string
  conclusion?: string
}

export type ActionArea =
  | "Google Ads"
  | "Meta Ads"
  | "Criativos"
  | "Copy"
  | "Landing Page"
  | "WhatsApp"
  | "Comercial"
  | "Oferta"
  | "Rastreamento"
  | "Estratégia"
  | "Relatório"
  | "Financeiro"

export type ActionPriority = "alta" | "média" | "baixa"
export type ActionStatus = "pendente" | "em andamento" | "concluído"

export interface ActionPlan {
  id: string
  report_id: string
  client_id: string
  action: string
  area: ActionArea
  priority: ActionPriority
  deadline?: string
  responsible?: string
  status: ActionStatus
}

export interface DashboardMetrics {
  total_spend: number
  total_leads: number
  total_conversions: number
  total_sales: number
  total_revenue: number
  avg_cpl: number
  avg_cpa: number
  roas: number
  roi: number
  ctr: number
  cpc: number
  impressions: number
  clicks: number
  prev_total_spend?: number
  prev_total_leads?: number
  prev_total_conversions?: number
  prev_total_revenue?: number
}
