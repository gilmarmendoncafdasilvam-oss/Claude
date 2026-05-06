# TrafficDash – Guia de Deploy

## Stack
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Deploy:** Vercel
- **Gráficos:** Recharts
- **UI:** Radix UI (componentes customizados)

---

## 1. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o arquivo `supabase/schema.sql`
3. Em **Authentication → Settings**, configure:
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/auth/callback`
4. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```
Preencha com suas chaves do Supabase.

---

## 3. Instalar dependências e rodar localmente

```bash
npm install
npm run dev
```
Acesse: http://localhost:3000

---

## 4. Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Ou conecte o repositório em [vercel.com](https://vercel.com) e configure as variáveis de ambiente no painel.

---

## 5. Criar usuário administrador

No Supabase Dashboard → Authentication → Users, crie um usuário:
- E-mail: admin@suaagencia.com
- Senha: (senha segura)

Em seguida, no SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin', name = 'Admin'
WHERE email = 'admin@suaagencia.com';
```

---

## 6. Criar usuário cliente

1. No painel admin, vá em **Usuários → Novo Usuário**
2. Preencha nome, e-mail, senha
3. Selecione perfil **Cliente**
4. Vincule ao cliente

Ou via SQL:
```sql
-- Após criar o usuário no Supabase Auth
UPDATE profiles 
SET role = 'client', client_id = 'uuid-do-cliente', name = 'Nome do Cliente'
WHERE email = 'cliente@empresa.com.br';
```

---

## 7. Importar dados

1. Faça login como admin
2. Vá em **Importar Dados**
3. Selecione o cliente e tipo de dado
4. Baixe o **Modelo CSV** para ver as colunas esperadas
5. Preencha com os dados reais
6. Faça o upload e confirme

---

## 8. Evolução futura (Roadmap)

### Integrações via API (próximas etapas)
- [ ] Google Ads API → `lib/integrations/google-ads.ts`
- [ ] Meta Ads API → `lib/integrations/meta-ads.ts`
- [ ] Google Analytics 4 Data API → `lib/integrations/ga4.ts`
- [ ] WhatsApp Business API → `lib/integrations/whatsapp.ts`
- [ ] CRM (HubSpot / RD Station) → `lib/integrations/crm.ts`

### Funcionalidades adicionais
- [ ] Alertas automáticos por e-mail (Resend / SendGrid)
- [ ] Envio automático de relatórios semanais
- [ ] Diagnóstico com IA (Claude API)
- [ ] Comparativos automáticos entre períodos
- [ ] Exportação PDF server-side (Puppeteer)
- [ ] Dashboard público (link sem login)
- [ ] App mobile (React Native / Expo)

---

## 9. Segurança

- Todas as tabelas têm **Row Level Security (RLS)** ativado
- Clientes só podem ver seus próprios dados (policy por `client_id`)
- Admins têm acesso completo
- Senhas gerenciadas pelo Supabase Auth (bcrypt + JWT)
- Recuperação de senha via e-mail pelo Supabase
- Rotas protegidas por verificação de sessão no client-side

---

## 10. Estrutura do projeto

```
src/
├── app/
│   ├── login/              # Página de login
│   ├── forgot-password/    # Recuperação de senha
│   ├── admin/              # Painel administrativo
│   │   ├── clients/        # Gestão de clientes
│   │   ├── users/          # Gestão de usuários
│   │   ├── reports/        # Gestão de relatórios
│   │   ├── import/         # Importação de dados
│   │   └── settings/       # Configurações
│   └── client/             # Área do cliente
│       ├── dashboard/      # Dashboard principal
│       ├── google-ads/     # Google Ads
│       ├── meta-ads/       # Meta Ads
│       ├── ga4/            # Site / GA4
│       ├── whatsapp/       # WhatsApp / Comercial
│       ├── funnel/         # Funil de conversão
│       ├── financial/      # Análise financeira
│       ├── diagnostic/     # Diagnóstico estratégico
│       └── action-plan/    # Plano de ação
├── components/
│   ├── ui/                 # Componentes base (Button, Card, Input...)
│   ├── layout/             # Sidebar, Header
│   ├── dashboard/          # MetricCard, FunnelChart
│   └── charts/             # LineChart, BarChart, PieChart
└── lib/
    ├── supabase/           # Client e Server Supabase
    ├── types.ts            # Tipos TypeScript
    ├── utils.ts            # Fórmulas e utilitários
    └── mock-data.ts        # Dados de demonstração
```
