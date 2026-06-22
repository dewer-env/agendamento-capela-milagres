# Tema Visual — Creme/Bege

## Paleta de cores

### Backgrounds
- Fundo principal (página):     #FAF7F2
- Fundo de cards/sidebar:       #F5F0E8
- Fundo hover em dias:          #F0E8E0
- Fundo dias reservados:        #FDF0F0

### Bordas
- Borda padrão:                 #E8E0D5
- Borda inputs/botões nav:      #D4C5B8

### Texto
- Texto principal:              #3D2B1F
- Texto secundário/labels:      #A08C7E
- Texto muted (nav, ícones):    #7A6358

### Acento (reservado)
- Badge background:             #F5C4B3
- Badge texto:                  #712B13

### Acento (hoje / selecionado)
- Círculo "hoje":               #3D2B1F  (fundo)
- Texto em "hoje":              #FAF7F2  (claro)

### Botão WhatsApp
- Background:                   #3D2B1F
- Texto:                        #FAF7F2

---

## Tipografia

- Font family: mesma do projeto (sans-serif padrão)
- Mês/título principal: 20px, font-weight 500, cor #3D2B1F
- Ano ao lado do mês: mesma fonte, opacity 0.5, cor #A08C7E
- Dias da semana (header): 11px, uppercase, letter-spacing 0.05em, cor #A08C7E
- Número do dia: 13px, font-weight 500, cor #3D2B1F
- Badge "Reservado": 11px, font-weight 500
- Labels da sidebar (ex: "Seus dados"): 11px, uppercase, letter-spacing 0.06em, cor #A08C7E

---

## Estrutura de layout

- Layout: sidebar fixa à esquerda (200px) + calendário à direita (flex: 1)
- Gap entre sidebar e calendário: 1.5rem

### Sidebar
- Cards com fundo #F5F0E8, borda 0.5px solid #E8E0D5, border-radius 12px, padding 1.25rem
- Mini calendário de navegação dentro do primeiro card
- Campos de nome e email abaixo
- Legenda com três dots: disponível (#E8E0D5), reservado (#F5C4B3), selecionado (#3D2B1F)
- Botão WhatsApp na base: fundo #3D2B1F, texto #FAF7F2, desabilitado com opacity 0.4 enquanto nenhuma data está selecionada

### Calendário principal
- Borda externa: 0.5px solid #E8E0D5, border-radius 12px, overflow hidden
- Header: fundo #FAF7F2, borda inferior 0.5px solid #E8E0D5, padding 1.25rem 1.5rem
  - Botões de navegação: borda #D4C5B8, cor #7A6358, hover fundo #F0E8E0
- Row de dias da semana: fundo #F5F0E8, borda inferior 0.5px solid #E8E0D5
- Grid: 7 colunas iguais
- Cada célula de dia:
  - min-height: 72px
  - padding: 8px
  - borda superior: 0.5px solid #E8E0D5
  - fundo padrão: #FAF7F2
  - hover (disponível): #F5F0E8
  - reservado: fundo #FDF0F0, badge pill com fundo #F5C4B3 e texto #712B13
  - dias de outro mês: opacity 0.3
  - dia atual: número dentro de círculo #3D2B1F com texto #FAF7F2

### Badge "Reservado"
- Display: inline-flex, align-items center, gap 5px
- Padding: 3px 8px
- Border-radius: 20px (pill)
- Ícone: bolinha preenchida pequena à esquerda
- Largura: 100% da célula

---

## Regras gerais

- Sem sombras (box-shadow: none)
- Sem gradientes
- Bordas sempre 0.5px (não 1px)
- Bordas externas de cards e do calendário: border-radius 12px
- Bordas internas (células do calendário): sem border-radius
- Transições suaves: transition: background 0.12s