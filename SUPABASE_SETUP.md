# Configuração do Supabase

## 1. Configure as credenciais

Edite o arquivo `src/integrations/supabase/client.ts` e substitua:
- `YOUR_SUPABASE_URL` pela URL do seu projeto
- `YOUR_SUPABASE_ANON_KEY` pela chave anônima do seu projeto

Você encontra essas informações em: **Project Settings > API**

## 2. Execute a migration

No painel do Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo:
`supabase/migrations/20250101000000_create_b2b_structure.sql`

## 3. Estrutura criada

### Tabelas
- **real_estates**: Dados das imobiliárias (CNPJ, CRECI, status de aprovação)
- **real_estate_users**: Vincula usuários autenticados às imobiliárias
- **properties**: Imóveis (com suporte a tour_360_url)
- **property_images**: Até 6 fotos por imóvel (display_order 1-6)

### Storage Buckets
- **property-images**: Fotos dos imóveis (públicas)
- **real-estate-logos**: Logos das imobiliárias (públicas)
- **property-tours**: Vídeos tour 360 (públicas)

### Segurança (RLS)
- Usuários comuns: apenas visualizam imóveis ativos de imobiliárias aprovadas
- Imobiliárias: apenas aprovadas podem cadastrar imóveis
- Cada imobiliária vê/edita apenas seus próprios dados

## 4. Fluxo B2B
1. Imobiliária se cadastra (status: pending)
2. Admin aprova no banco (status: approved)
3. Imobiliária pode cadastrar imóveis com até 6 fotos + tour 360
4. Usuários buscam e visualizam apenas imóveis de imobiliárias aprovadas
