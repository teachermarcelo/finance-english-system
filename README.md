# Atualização do frontend - Fluent Finance

## Onde inserir

### 1. No seu repositório GitHub
Substitua estes arquivos/pastas:
- `src/` inteiro
- `vite.config.js`
- `package.json`
- `.env.example`

### 2. No Supabase
Rode o arquivo:
- `supabase-rls-fix.sql`

## Passo a passo
1. Baixe este pacote.
2. Apague a pasta `src` atual do seu projeto.
3. Cole a nova pasta `src` no lugar.
4. Substitua `vite.config.js` e `package.json`.
5. Rode o SQL `supabase-rls-fix.sql` no Supabase SQL Editor.
6. No terminal, rode:
   - `npm install`
   - `npm run build`
7. Faça commit e push.

## O que esta atualização corrige
- envia `user_id` em todos os inserts/updates
- usa valores corretos no frontend: `ativo`, `inativo`, `entrada`, `saida`, `pago`, `pendente`, `atrasado`
- corrige campos de data com `type=date`
- melhora dashboard e telas
- mantém compatibilidade com GitHub Pages
