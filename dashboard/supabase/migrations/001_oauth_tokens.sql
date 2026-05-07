-- OAuth tokens per client per provider
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id    TEXT NOT NULL,
  provider     TEXT NOT NULL, -- 'meta_ads', 'google_ads', 'ga4', 'meta_business', 'whatsapp', 'rd_station'
  access_token TEXT,          -- encrypted in production with pgcrypto
  refresh_token TEXT,
  expires_at   TIMESTAMPTZ,
  account_id   TEXT,
  account_name TEXT,
  scope        TEXT,
  raw          JSONB,          -- full provider response
  connected    BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, provider)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER oauth_tokens_updated_at
  BEFORE UPDATE ON oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name         TEXT,
  role         TEXT DEFAULT 'member', -- 'admin', 'member', 'client'
  member_role  TEXT,                  -- 'gestor', 'analista', 'funcionario', 'visualizador'
  permissions  TEXT[] DEFAULT '{}',
  client_id    TEXT,                  -- for role='client', links to clients table
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name    TEXT NOT NULL,
  trade_name      TEXT,
  segment         TEXT,
  website         TEXT,
  instagram       TEXT,
  main_objective  TEXT,
  city            TEXT,
  state           TEXT,
  status          TEXT DEFAULT 'ativo',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Member ↔ Client assignments
CREATE TABLE IF NOT EXISTS member_clients (
  member_id  UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id  UUID REFERENCES clients(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, client_id)
);

-- Auto-update updated_at for clients table
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Admins see everything (via service role key on the backend)
-- Members see only their assigned clients' tokens (future implementation)

-- ---------------------------------------------------------------------------
-- Seed demo users for development (run only in dev)
-- These match the DEMO_USERS in login/page.tsx
-- In production, real users are created via Supabase Auth dashboard or invite.
-- ---------------------------------------------------------------------------

-- Seed demo clients (idempotent via INSERT ... ON CONFLICT DO NOTHING)
INSERT INTO clients (id, company_name, trade_name, segment, website, instagram, main_objective, city, state, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Clínica Saúde Total',      'Saúde Total',      'Saúde / Clínica Médica', 'https://saudetotal.com.br',     '@clinicasaudetotal', 'Gerar leads para consultas e procedimentos estéticos', 'São Paulo', 'SP', 'ativo'),
  ('00000000-0000-0000-0000-000000000002', 'Academia Corpo em Forma',   'Corpo em Forma',   'Fitness / Academia',     'https://corpoemforma.com.br',   '@corpoemforma',      'Captação de novos alunos mensalistas',                  'Campinas',  'SP', 'ativo'),
  ('00000000-0000-0000-0000-000000000003', 'Escritório Jurídico Mendes','Mendes Advogados', 'Jurídico',               'https://mendesadvogados.com.br', '@mendesadvogados',   'Leads para consultoria jurídica trabalhista',            'Rio de Janeiro', 'RJ', 'ativo')
ON CONFLICT (id) DO NOTHING;

-- Note: user_profiles rows require a matching auth.users row (FK constraint).
-- To seed demo auth users, run the following in the Supabase dashboard SQL editor
-- or via the Supabase Management API — they cannot be inserted directly here
-- because auth.users is managed by GoTrue.
--
-- Demo credentials (for reference):
--   admin@agencia.com       / admin123   → role: admin
--   maria@agencia.com       / membro123  → role: member, member_role: gestor
--   joao@agencia.com        / membro123  → role: member, member_role: analista
--   carlos@saudetotal.com.br / cliente123 → role: client, client_id: c1
--   ana@corpoemforma.com.br  / cliente123 → role: client, client_id: c2
--
-- After creating the auth users, insert their profiles like:
--   INSERT INTO user_profiles (id, name, role, member_role, permissions, client_id)
--   VALUES ('<auth_user_uuid>', 'Admin Agência', 'admin', NULL, '{}', NULL)
--   ON CONFLICT (id) DO NOTHING;
