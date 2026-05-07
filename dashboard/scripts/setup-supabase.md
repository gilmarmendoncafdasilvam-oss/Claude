# Configuração do Supabase — TrafficDash

## 1. Criar projeto no Supabase

1. Acesse https://supabase.com e clique em **New Project**
2. Escolha um nome (ex: `trafficdash-prod`)
3. Gere uma senha forte para o banco
4. Aguarde ~2 minutos enquanto o projeto é criado

## 2. Executar a migration

Abra o **SQL Editor** no painel do Supabase e cole o conteúdo de:
```
supabase/migrations/001_oauth_tokens.sql
```

Isso cria as tabelas: `oauth_tokens`, `user_profiles`, `clients`, `member_clients`

## 3. Criar os usuários demo (opcional)

No **SQL Editor**, execute este bloco para criar os usuários de demonstração.
Substitua os UUIDs pelos gerados pelo Supabase Auth:

### Passo A — criar usuários no Auth
No Supabase Dashboard → Authentication → Users → **Add user** (ou via API):

| E-mail                        | Senha       |
|-------------------------------|-------------|
| admin@agencia.com             | admin123    |
| maria@agencia.com             | membro123   |
| joao@agencia.com              | membro123   |
| carlos@saudetotal.com.br      | cliente123  |
| ana@corpoemforma.com.br       | cliente123  |

### Passo B — inserir perfis (após criar no Auth)
Copie os UUIDs gerados e execute no SQL Editor:

```sql
-- Substitua <UUID_ADMIN>, <UUID_MARIA>, etc. pelos UUIDs reais do Auth
INSERT INTO user_profiles (id, name, role, member_role, permissions, client_id) VALUES
  ('<UUID_ADMIN>',   'Admin Agência',   'admin',  NULL,       '{}',                                NULL),
  ('<UUID_MARIA>',   'Maria Santos',    'member', 'gestor',   ARRAY['clients.view','clients.edit','reports.view','reports.create','reports.edit','action_plans.view','action_plans.edit','action_plans.publish','data.import','data.export','integrations.view','integrations.manage'], NULL),
  ('<UUID_JOAO>',    'João Ferreira',   'member', 'analista', ARRAY['clients.view','reports.view','reports.create','action_plans.view','action_plans.edit','data.import','data.export'], NULL),
  ('<UUID_CARLOS>',  'Dr. Carlos Mendes','client', NULL,      '{}',                                '00000000-0000-0000-0000-000000000001'),
  ('<UUID_ANA>',     'Ana Lima',        'client', NULL,       '{}',                                '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;
```

## 4. Obter as credenciais

No painel do Supabase → **Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon (public) key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ nunca expor no client

## 5. Configurar variáveis de ambiente no Vercel

No painel do Vercel → Settings → Environment Variables, adicione:

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY       = eyJhbGci...  (⚠️ server-only, não prefixar com NEXT_PUBLIC_)

META_APP_ID                     = seu_app_id_do_facebook
META_APP_SECRET                 = seu_app_secret
NEXT_PUBLIC_META_APP_ID         = mesmo valor do META_APP_ID

GOOGLE_CLIENT_ID                = xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET            = GOCSPX-xxxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID    = mesmo valor do GOOGLE_CLIENT_ID

NEXTAUTH_URL                    = https://dashboard-five-mu-26.vercel.app
NEXT_PUBLIC_APP_URL             = https://dashboard-five-mu-26.vercel.app
```

## 6. Configurar RLS (Row Level Security)

No SQL Editor, execute para permitir acesso via service role:

```sql
-- Service role bypasses RLS automaticamente.
-- Para acesso via anon key (futuro uso), adicione policies:

CREATE POLICY "Admins read all tokens" ON oauth_tokens
  FOR SELECT USING (true); -- restringir por auth.uid() em produção

CREATE POLICY "Service role full access" ON oauth_tokens
  FOR ALL USING (true);
```

## 7. Testar

Após configurar, acesse o dashboard e faça login.
Em qualquer cliente → aba **Integrações** → clique **Conectar** em Meta Ads ou Google Ads.
O fluxo OAuth redirecionará para o provedor e voltará com o token salvo no Supabase.

---

## Fluxo OAuth completo

```
Usuário clica "Conectar Meta Ads"
        ↓
Redireciona para facebook.com/dialog/oauth
        ↓
Usuário autoriza no Facebook
        ↓
Facebook redireciona para /api/oauth/meta/callback?code=...
        ↓
Servidor troca code por access_token (server-side, seguro)
        ↓
Token salvo no Supabase (oauth_tokens table)
        ↓
Redireciona para /admin/clients/[id]?oauth_success=1
        ↓
UI atualiza o card para "Conectado ✓" (sem token na URL)
```
