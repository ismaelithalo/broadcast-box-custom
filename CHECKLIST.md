# Checklist de Modificações - Broadcast Box Custom

- [x] **1. Sistema de Personalização Visual e Temas via Painel de Admin**
  - [x] Personalizar cores do sistema (cor primária, cor de fundo, barra de navegação, cards)
  - [x] Personalizar fonte da interface (famílias de fontes pré-configuradas)
  - [x] Estilos prontos de cores com degradê (presets: Midnight Aurora, Sunset Glow, Cyberpunk Neon, Ocean Deep, Emerald Forest, Obsidian Minimal)
  - [x] Upload de imagens de background (fundo global com suporte a múltiplos formatos)
  - [x] Upload e configuração de backgrounds personalizados para perfis/canais individuais
  - [x] Alterar o nome da plataforma dinamicamente na interface (Navbar, títulos, abas)
  - [x] Alterar o ícone (favicon) e logo da plataforma com upload direto pelo painel
- [ ] **2. Gerenciamento de MOTD e Visibilidade no Painel de Admin**
  - [ ] Visualizar e editar o MOTD diretamente na tabela/modal de perfis no painel Admin
  - [ ] Alternar visibilidade (Público/Privado) diretamente pelo painel Admin
- [ ] **3. Suporte a Português do Brasil (PT-BR) e Idioma Padrão**
  - [ ] Adicionar arquivo de tradução completo em Português do Brasil (`pt-BR`)
  - [ ] Definir PT-BR como idioma padrão da plataforma
  - [ ] Permitir configurar o idioma padrão através do painel de Admin
- [ ] **4. Webhook / Endpoint de Alertas de Transmissões Iniciadas**
  - [ ] Cadastrar URL de endpoint no painel/configurações para disparo de notificações de início de live
  - [ ] Disparar payload com dados da transmissão (streamKey, MOTD, horário, etc.) ao iniciar uma live
