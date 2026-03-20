# LegislaApp - Assistente Legislativo Municipal

Sistema web para elaboração de propostas legislativas municipais com assistência jurídica baseada em LLM, validação de conformidade e rastreabilidade completa.

## 🎨 Design

Interface desenvolvida com as cores oficiais de **Nova Veneza, SC**:
- **Azul (Veneza)** - Símbolo de justiça, nobreza e lealdade
- **Vermelho (Rosso)** - Dedicação, coragem e valentia
- **Dourado (Oro)** - Presente na gôndola veneziana

## 🚀 Funcionalidades

### ✅ Implementado (MVP)
- ✅ Autenticação e login
- ✅ Dashboard com visão geral das proposições
- ✅ Seleção de município (Nova Veneza, Criciúma, Forquilhinha)
- ✅ Wizard guiado para criação de proposições
- ✅ Editor estruturado de minutas legislativas
- ✅ Assistente jurídico com sugestões em tempo real
- ✅ Validação de conformidade
- ✅ Citações normativas (LOM)
- ✅ Interface responsiva

### 🔮 Próximas Fases
- 📋 Integração com LLM (Gemini/Claude) via API
- 📋 RAG com base normativa (LOM, Regimento Interno)
- 📋 Exportação para DOCX/PDF
- 📋 Sistema de versionamento
- 📋 Painel administrativo
- 📋 Trilha de auditoria completa

## 📦 Tecnologias

- **React 18** - Framework frontend
- **Vite** - Build tool
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passo a Passo

1. **Instalar dependências**
```bash
cd legisla-app
npm install
```

2. **Executar em modo desenvolvimento**
```bash
npm run dev
```

3. **Acessar aplicação**
Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📁 Estrutura do Projeto

```
legisla-app/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Layout principal com sidebar
│   ├── pages/
│   │   ├── Login.jsx            # Página de autenticação
│   │   ├── Dashboard.jsx        # Visão geral
│   │   ├── SelectMunicipality.jsx  # Seleção de município
│   │   ├── CreateProposal.jsx   # Wizard de criação
│   │   └── ProposalEditor.jsx   # Editor de minutas
│   ├── App.jsx                  # Router principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Como Usar

### 1. Login
- Use qualquer email/senha para fazer login (simulado)
- O sistema redireciona para o dashboard

### 2. Selecionar Município
- Clique em "Município" na sidebar
- Escolha Nova Veneza, Criciúma ou Forquilhinha
- O perfil normativo é carregado automaticamente

### 3. Criar Nova Proposição
- Clique em "Nova Proposição" na sidebar
- Siga o wizard de 5 passos:
  - Tipo de Proposição (PL Ordinária, Complementar, Decreto, Indicação)
  - Tema e Objetivo
  - Verificação de Competência
  - Impacto Orçamentário
  - Justificativa

### 4. Editar Minuta
- O sistema gera uma minuta estruturada
- Use o editor para ajustar cada seção:
  - Ementa
  - Preâmbulo
  - Artigos
  - Vigência
  - Revogação
- Consulte o Assistente Jurídico no painel lateral
- Aplique sugestões e citações normativas

### 5. Validar e Exportar
- Validações automáticas aparecem no topo
- Salve o rascunho
- Exporte para DOCX/PDF (próxima fase)

## 🎨 Paleta de Cores

```css
Azul Veneza:
  50: #eff6ff
  500: #2563eb  (principal)
  700: #1e40af
  900: #1a2952

Vermelho Rosso:
  50: #fef2f2
  500: #dc2626  (destaque)
  700: #991b1b

Dourado Oro:
  50: #fffbeb
  500: #f59e0b  (acento)
  700: #b45309
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📝 Customização

### Adicionar Novo Município

Edite `src/pages/SelectMunicipality.jsx`:

```javascript
const municipalities = [
  {
    id: 4,
    name: 'Seu Município',
    state: 'SC',
    population: '50.000',
    lomVersion: '1.0',
    lastUpdate: '2024-03-01',
    proposals: 0
  },
  // ...
]
```

### Alterar Cores

Edite `tailwind.config.js` para personalizar a paleta.

## 🐛 Troubleshooting

**Erro ao instalar dependências:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Porta 3000 em uso:**
Edite `vite.config.js` e altere a porta:
```javascript
server: {
  port: 3001
}
```

## 📄 Licença

Este projeto é parte do sistema LegislaApp para apoio a propostas legislativas municipais.

## 👨‍💻 Próximos Passos

1. Integrar com backend TypeScript
2. Implementar RAG com base normativa
3. Adicionar exportação DOCX/PDF
4. Sistema de autenticação real
5. Painel administrativo
6. Deploy em produção

---

**Versão:** 1.0.0  
**Desenvolvido para:** Nova Veneza, SC  
**Data:** Março 2026
