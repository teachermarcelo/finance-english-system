# English Finance System

Sistema web completo em **React + Vite + Supabase** para controle financeiro de uma escola de inglês.

## Funcionalidades

- Login e cadastro com Supabase Auth
- Cadastro de alunos
- Cadastro e controle de mensalidades
- Registro de entradas e saídas
- Dashboard com cards e gráficos
- Links e observações extras
- CRUD completo
- Filtros por mês, aluno e status
- Interface responsiva, colorida e em português do Brasil
- Pronto para GitHub Pages usando `HashRouter`

## Tecnologias

- React
- Vite
- Tailwind CSS
- React Router
- Recharts
- Supabase
- react-hot-toast
- lucide-react

## Como usar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 3. Crie as tabelas no Supabase

Execute o arquivo `supabase-schema.sql` no SQL Editor do Supabase.

### 4. Rode localmente

```bash
npm run dev
```

### 5. Gere build

```bash
npm run build
```

## Deploy no GitHub Pages

Como o projeto usa `HashRouter` e `base: './'`, ele já fica mais amigável para deploy estático no GitHub Pages.

Fluxo simples:

1. Suba o projeto para o GitHub
2. Rode `npm install`
3. Rode `npm run build`
4. Publique a pasta `dist/` no GitHub Pages ou configure GitHub Actions

## Estrutura principal

```text
src/
  components/
  contexts/
  hooks/
  layouts/
  lib/
  pages/
  utils/
```

## Observação importante sobre RLS

As tabelas usam **Row Level Security** para que cada usuário veja e edite apenas os próprios dados.
