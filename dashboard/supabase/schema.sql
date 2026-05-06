-- TrafficDash – Schema completo
-- Execute no SQL Editor do Supabase

-- =====================================================
-- EXTENSÕES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: clients
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  trade_name TEXT,
  segment TEXT,
  website TEXT,
  instagram TEXT,
  main_objective TEXT,
  city TEXT,
  state CHAR(2),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pausado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: profiles (extensão do auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  client_id UUID REFERENCES clients(id),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: reports
-- =====================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('semanal', 'mensal', 'trimestral', 'personalizado')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  title TEXT NOT NULL,
  executive_summary TEXT,
  main_highlight TEXT,
  main_warning TEXT,
  next_steps TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: paid_media_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS paid_media_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  campaign_name TEXT,
  ad_group_name TEXT,
  ad_name TEXT,
  objective TEXT,
  spend NUMERIC(12,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER,
  frequency NUMERIC(6,2),
  clicks INTEGER DEFAULT 0,
  link_clicks INTEGER,
  ctr NUMERIC(8,4) DEFAULT 0,
  cpc NUMERIC(10,2) DEFAULT 0,
  cpm NUMERIC(10,2) DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate NUMERIC(8,4) DEFAULT 0,
  cpl NUMERIC(10,2) DEFAULT 0,
  cpa NUMERIC(10,2) DEFAULT 0,
  revenue NUMERIC(12,2),
  roas NUMERIC(8,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: google_ads_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS google_ads_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  ad_group_name TEXT,
  keyword TEXT,
  search_term TEXT,
  match_type TEXT,
  spend NUMERIC(12,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC(8,4) DEFAULT 0,
  cpc NUMERIC(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  cost_per_conversion NUMERIC(10,2) DEFAULT 0,
  conversion_rate NUMERIC(8,4) DEFAULT 0,
  impression_share NUMERIC(6,2),
  top_impression_share NUMERIC(6,2),
  absolute_top_impression_share NUMERIC(6,2),
  lost_is_budget NUMERIC(6,2),
  lost_is_rank NUMERIC(6,2),
  quality_score INTEGER,
  status TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: meta_ads_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS meta_ads_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  ad_set_name TEXT,
  ad_name TEXT,
  creative_name TEXT,
  audience TEXT,
  placement TEXT,
  objective TEXT,
  spend NUMERIC(12,2) DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  frequency NUMERIC(6,2) DEFAULT 0,
  cpm NUMERIC(10,2) DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  link_clicks INTEGER,
  ctr NUMERIC(8,4) DEFAULT 0,
  cpc NUMERIC(10,2) DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversations INTEGER,
  cost_per_lead NUMERIC(10,2) DEFAULT 0,
  cost_per_conversation NUMERIC(10,2),
  landing_page_views INTEGER,
  profile_visits INTEGER,
  engagements INTEGER,
  video_views INTEGER,
  hook_rate NUMERIC(6,2),
  hold_rate NUMERIC(6,2),
  thumbstop_rate NUMERIC(6,2),
  status TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: ga4_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS ga4_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sessions INTEGER DEFAULT 0,
  users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  engaged_sessions INTEGER DEFAULT 0,
  engagement_rate NUMERIC(6,2) DEFAULT 0,
  average_engagement_time INTEGER DEFAULT 0,
  bounce_rate NUMERIC(6,2) DEFAULT 0,
  key_events INTEGER,
  conversions INTEGER DEFAULT 0,
  conversion_rate NUMERIC(6,4) DEFAULT 0,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  device TEXT,
  landing_page TEXT,
  exit_page TEXT,
  whatsapp_clicks INTEGER,
  form_submits INTEGER,
  button_clicks INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: whatsapp_commercial_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS whatsapp_commercial_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  conversations_started INTEGER DEFAULT 0,
  messages_received INTEGER,
  leads_answered INTEGER DEFAULT 0,
  leads_not_answered INTEGER DEFAULT 0,
  average_response_time NUMERIC(6,1),
  response_rate NUMERIC(6,2) DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  unqualified_leads INTEGER DEFAULT 0,
  scheduled_appointments INTEGER DEFAULT 0,
  show_ups INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  proposals_sent INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  close_rate NUMERIC(6,2) DEFAULT 0,
  cost_per_conversation NUMERIC(10,2),
  cost_per_appointment NUMERIC(10,2),
  cost_per_sale NUMERIC(10,2),
  lost_reasons TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: funnel_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS funnel_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  site_visits INTEGER DEFAULT 0,
  landing_page_views INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  whatsapp_conversations INTEGER DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  appointments INTEGER DEFAULT 0,
  show_ups INTEGER DEFAULT 0,
  proposals INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  click_through_rate NUMERIC(8,4) DEFAULT 0,
  page_conversion_rate NUMERIC(8,4) DEFAULT 0,
  lead_to_appointment_rate NUMERIC(8,4) DEFAULT 0,
  appointment_to_sale_rate NUMERIC(8,4) DEFAULT 0,
  overall_conversion_rate NUMERIC(10,6) DEFAULT 0,
  main_bottleneck TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: financial_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  media_spend NUMERIC(12,2) DEFAULT 0,
  management_fee NUMERIC(12,2) DEFAULT 0,
  total_marketing_cost NUMERIC(12,2) DEFAULT 0,
  revenue NUMERIC(12,2),
  gross_profit NUMERIC(12,2),
  average_ticket NUMERIC(10,2),
  sales_count INTEGER,
  cac NUMERIC(10,2),
  roas NUMERIC(8,4),
  roi NUMERIC(8,2),
  break_even_revenue NUMERIC(12,2),
  ltv NUMERIC(12,2),
  payback NUMERIC(6,2),
  margin NUMERIC(6,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: diagnostics
-- =====================================================
CREATE TABLE IF NOT EXISTS diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  performance_status TEXT NOT NULL DEFAULT 'estável' CHECK (performance_status IN ('excelente', 'bom', 'estável', 'atenção', 'crítico')),
  what_improved TEXT,
  what_worsened TEXT,
  main_problem TEXT,
  main_opportunity TEXT,
  traffic_diagnosis TEXT,
  offer_diagnosis TEXT,
  landing_page_diagnosis TEXT,
  commercial_diagnosis TEXT,
  financial_diagnosis TEXT,
  conclusion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: action_plans
-- =====================================================
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  area TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'média' CHECK (priority IN ('alta', 'média', 'baixa')),
  deadline DATE,
  responsible TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em andamento', 'concluído')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: import_history
-- =====================================================
CREATE TABLE IF NOT EXISTS import_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),
  import_type TEXT NOT NULL,
  file_name TEXT,
  rows_imported INTEGER DEFAULT 0,
  rows_failed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'concluído',
  imported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE paid_media_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_ads_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ads_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ga4_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_commercial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_history ENABLE ROW LEVEL SECURITY;

-- Helper function: retorna o perfil do usuário atual
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS TABLE(role TEXT, client_id UUID) AS $$
  SELECT role, client_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Admins: acesso total
CREATE POLICY "Admins can do anything on clients" ON clients
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can do anything on reports" ON reports
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Clients: veem apenas seus próprios dados
CREATE POLICY "Clients see own reports" ON reports
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Clients see own paid media" ON paid_media_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access google ads" ON google_ads_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access meta ads" ON meta_ads_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access ga4" ON ga4_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access whatsapp" ON whatsapp_commercial_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access funnel" ON funnel_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access financial" ON financial_metrics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access diagnostics" ON diagnostics
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Access action plans" ON action_plans
  FOR SELECT USING (
    client_id = (SELECT client_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Profiles: cada usuário vê apenas seu próprio perfil (admin vê todos)
CREATE POLICY "Users see own profile" ON profiles
  USING (
    id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- TRIGGER: atualiza updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- TRIGGER: cria perfil automaticamente após signup
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
