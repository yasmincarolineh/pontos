# Sistema Integrado de Gestão e Operações (Vanilla Stack)

Este repositório contém a aplicação web para o Sistema Integrado de Gestão e Operações, construído com uma arquitetura Vanilla JS (zero build step) adaptada para telas de Tablets (>=768px) e Desktops (>=1024px).

## Arquitetura e Tecnologia

- **Frontend Core**: HTML5 + CSS3 (CSS Variables, Flexbox, Grid Layout).
- **Estilização Auxiliar**: Tailwind CSS via CDN.
- **Ícones**: Lucide Icons via CDN (Sem emojis na interface/código).
- **JavaScript**: ES6 Modules nativos no navegador (`type="module"`).
- **Backend & Autenticação**: Supabase Client SDK via CDN ESM (`@supabase/supabase-js`).
- **APIs Nativas Web**: Câmera (`navigator.mediaDevices`), Geolocalização (`navigator.geolocation`).

## Estrutura de Diretorios

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
├── backlog.md              # Registro de rastreabilidade de tarefas
├── index.html              # Interface principal (Tablet/Desktop)
├── schema.sql              # Script SQL de referência para o Supabase
└── README.md
```

## Como Executar

Por ser uma aplicação **Zero Build Step**, nenhum gerenciador de pacotes (npm/yarn/vite) é necessário.
Basta abrir o arquivo `index.html` usando um servidor HTTP estático simples, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

E acessar no navegador (Tablet ou Desktop).

## Configuração do Supabase

Substitua as variáveis em `js/config/supabase.js` pelas credenciais do seu projeto Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Execute o arquivo `schema.sql` no SQL Editor do Supabase para criar as tabelas e políticas RLS de referência.
