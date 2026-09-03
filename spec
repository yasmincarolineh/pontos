# SPEC Principal do Projeto: Sistema Integrado de Gestão e Operações (Vanilla Stack)

> **Nota para Agentes de IA (ex.: Google Jules):** Este documento contém a especificação técnica completa do projeto. Leia, analise e estruture o plano de execução com base nestas diretrizes antes de iniciar qualquer desenvolvimento.

---

## 1. Instruções Críticas para Agentes de IA

1. **Dúvidas e Ambiguidade:**
   - **Não codifique se houver dúvidas ou inconsistências.** Interrompa o processo e solicite esclarecimentos formais sobre regras de negócio ou fluxos de dados não especificados.
2. **Decomposição Modular de Tarefas:**
   - Sempre divida programações extensas ou complexas em um detalhamento hierárquico de **tarefas e subtarefas** antes da execução.
3. **Registro Continuado e Rastreabilidade:**
   - Crie e mantenha atualizado um arquivo chamado `backlog.md` na raiz do repositório.
   - Registre todas as funcionalidades implementadas, refatoradas, corrigidas ou alteradas, indicando data, escopo e status de testes.

---

## 2. Visão Geral e Viabilidade Técnica

- **Nível de Confiança para Viabilidade:** **ALTO**
- **Justificativa de Viabilidade:**
  - A combinação de HTML, CSS e JavaScript Vanilla com Supabase (via CDN/ES Modules) elimina completamente bundlers (Vite, Webpack) e gerenciadores de pacotes (npm, yarn).
  - Redução extrema de complexidade de ambiente e tempo de build.
  - Compatibilidade nativa e direta com navegação em Tablets e Desktops modernos.

---

## 3. Arquitetura e Stack Tecnológica

| Camada | Tecnologia / Biblioteca | Carregamento / Função |
| :--- | :--- | :--- |
| **Agente Operacional** | Google Jules | Leitura da SPEC, criação do `backlog.md` e geração de código modular. |
| **Hospedagem & Repositório** | GitHub / GitHub Pages | Versionamento de código e hospedagem estática direta. |
| **Banco de Dados & Auth** | Supabase JS Client | `@supabase/supabase-js` via CDN (ESM). Autenticação e requisições REST/Realtime. |
| **Estrutura & Estilização** | HTML5 + CSS3 (Vanilla) | CSS moderno utilizando CSS Variables, Flexbox e Grid Layout. |
| **Estilização / Auxiliar** | Tailwind CSS (CDN/Play) | Inclusão via CDN sem necessidade de Node.js/CLI para utilitários de UI rápida. |
| **Biblioteca de Ícones** | Lucide Icons (Vanilla) | `lucide.js` via CDN para renderização dinâmica de ícones SVG. |
| **Lógica de Aplicação** | JavaScript Vanilla (ES6 Modules) | Componentização baseada em módulos JS (`import`/`export` nativos no navegador). |
| **APIs Nativas (Navegador)** | Web APIs Nativas | Acesso a Câmera (`navigator.mediaDevices`), Geolocalização (`navigator.geolocation`), Áudio nativo. |

---

## 4. Diretrizes de UI / UX

- **Público & Dispositivos:** Exclusivo para telas de **Tablets** (mínimo 768px) e **Desktops** (mínimo 1024px).
- **Tema & Visual:**
  - Fundo **estritamente claro/branco** (`#ffffff` / `#f8fafc`).
  - Layout limpo, alta legibilidade e foco em usabilidade profissional.
- **Ícones & Emojis:**
  - **Proibido o uso de emojis** no código e na interface gráfica.
  - Uso exclusivo da biblioteca de ícones `Lucide` carregada via CDN.
- **APIs Nativas do Navegador:**
  - Utilizar APIs nativas (Câmera, Geolocalização, Gravação de Áudio) apenas quando estritamente necessário para o fluxo funcional e mediante consentimento do usuário.

---

## 5. Estrutura do Repositório (Zero Build Step)

```text
.
├── css/
│   ├── main.css            # Variáveis globais, resets e layouts
│   └── components.css      # Estilos de componentes (modais, tabelas, cards)
├── js/
│   ├── config/
│   │   └── supabase.js     # Inicialização do cliente Supabase via CDN ESM
│   ├── services/
│   │   ├── auth.js         # Métodos de Login/Logout
│   │   └── api.js          # CRUD genérico usando cliente do Supabase
│   ├── utils/
│   │   ├── icons.js        # Helper para inicializar Lucide Icons
│   │   └── media.js        # Wrappers para Câmera/Geolocalização
│   └── app.js              # Ponto de entrada da aplicação
├── backlog.md              # Registro obrigatório mantido pela IA
├── index.html              # Interface principal (Tablet/Desktop)
├── schema.sql              # Script SQL de referência para o Supabase
└── README.md
```

---

## 6. Padrões de Código Vanilla & Redução de Erros

1. **Modularização JS Nativa:**
   - Usar `<script type="module" src="js/app.js"></script>` no `index.html`.
   - Separar a lógica em arquivos pequenos com `export` e `import`.
2. **Bibliotecas por CDN para Redução de Código:**
   - **Supabase SDK:** `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm`
   - **Lucide Icons:** `https://unpkg.com/lucide@latest`
3. **Tratamento Rigoroso de Erros:**
   - Toda chamada assíncrona ao Supabase deve utilizar `try/catch`.
   - Validar dados de entrada diretamente via HTML5 validation nativo e rotinas JS leves antes de enviar ao backend.

---

## 7. Estrutura Inicial do `backlog.md`

Todo agente de IA deve criar e gerenciar o `backlog.md` seguindo o formato abaixo:

```markdown
# Backlog do Projeto

## Status das Funcionalidades

| ID | Funcionalidade / Módulo | Status | Responsável | Data Conclusão | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TASK-001 | Estrutura Base HTML/CSS (Desktop/Tablet) | Concluído | Google Jules | YYYY-MM-DD | Layout limpo fundo branco |
| TASK-002 | Conexão Supabase via CDN ESM | Em Andamento | Google Jules | - | Criação do js/config/supabase.js |
| TASK-003 | Integração de Ícones Lucide | Pendente | - | - | Substituição total de emojis |
```

---
