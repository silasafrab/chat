<p align="center">
  <img alt="Chat" src="./web/src/assets/hero.png" width="120" height="120" style="border-radius: 24px;">
</p>

<h1 align="center">Chat — Plataforma de Comunicação</h1>

<p align="center">
  <strong>Aplicação web para gerenciamento e envio de mensagens em massa</strong>
  <br />
  Agende, organize e dispare mensagens para seus contatos através de múltiplas conexões.
</p>

<p align="center">
  <a href="https://chat-756b4.web.app/">🌐 Acessar aplicação</a>
  ·
  <a href="https://www.figma.com/design/loxXOTivWUCo0khiFNtoBy/Chat?node-id=17264-4397&t=A698FJzf33ukjWZa-1">🎨 Design no Figma</a>
</p>

<br />

## 📋 Funcionalidades

- **🔐 Autenticação** — Login e cadastro com email e senha via Firebase Auth
- **🔌 Gerenciamento de Conexões** — Crie e gerencie conexões (WhatsApp, Telegram, SMS, Email) com status ativo/inativo
- **👥 Gerenciamento de Contatos** — Cadastre contatos vinculados a uma conexão
- **✉️ Mensagens** — Crie mensagens com:
  - **Envio imediato** ou **agendamento** para data/hora específica
  - Seleção de contatos por conexão com combobox multi-select
  - Validação de conexão ativa no momento do envio
- **🚫 Bloqueio automático** — Mensagens agendadas são bloqueadas se a conexão for desativada antes do envio
- **📱 Design responsivo** — Layout adaptado para desktop e mobile
- **🌗 Tema claro/escuro** — Alternância entre tema claro, escuro e seguindo o sistema
- **🔍 Filtros e busca** — Filtre mensagens por status, tipo de conexão e conexão específica
- **📄 Paginação** — 10 itens por página em todas as listagens

## 🛠️ Tecnologias

### Frontend

| Tecnologia                | Finalidade                                              |
| ------------------------- | ------------------------------------------------------- |
| **React 19**              | Biblioteca de interface                                 |
| **TypeScript**            | Tipagem estática                                        |
| **Vite 8**                | Bundler e dev server                                    |
| **Tailwind CSS 4**        | Estilização utilitária                                  |
| **Radix UI**              | Componentes acessíveis (Sheet, Popover, Select, Switch) |
| **React Hook Form + Zod** | Formulários e validação                                 |
| **Firebase SDK**          | Autenticação e Firestore (tempo real)                   |
| **Lucide React**          | Ícones                                                  |
| **date-fns**              | Manipulação de datas                                    |
| **React IcoMoon**         | Ícones SVG customizados                                 |
| **Sonner**                | Notificações toast                                      |

### Backend (Firebase)

| Serviço                  | Finalidade                                               |
| ------------------------ | -------------------------------------------------------- |
| **Firebase Auth**        | Autenticação de usuários                                 |
| **Cloud Firestore**      | Banco de dados em tempo real                             |
| **Cloud Functions (v2)** | Função agendada para processar mensagens a cada 1 minuto |
| **Firebase Hosting**     | Hospedagem do frontend com SPA redirect                  |

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js 22+
- Firebase CLI (`npm install -g firebase-tools`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/silasafrab/chat
cd chat

# Instale as dependências do frontend
cd web
npm install

# Instale as dependências das Cloud Functions
cd ../functions
npm install
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** (email/senha), **Cloud Firestore** e **Functions**
3. Edite o arquivo `web/src/firebase/config.ts` com as credenciais do seu projeto:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Executar

```bash
# Terminal 1 — Frontend
cd web
npm run dev
# Acesse http://localhost:5173

# Terminal 2 — Functions (opcional, para processar agendamentos)
cd functions
npm run build
firebase emulators:start --only functions
```

## 🧪 Testes

```bash
cd web

# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch
```

### O que é testado

| Módulo                      | Cobertura                                         |
| --------------------------- | ------------------------------------------------- |
| **Validação do formulário** | Campos obrigatórios, agendamento futuro/passado   |
| **Lógica de status**        | Scheduled + conexão inativa = blocked             |
| **Serviço de mensagens**    | Criação com status sent/scheduled, update, delete |
| **Paginação**               | Navegação, clamping, recálculo                    |
| **Formatação**              | Telefone, CEP                                     |
| **Constantes**              | Tipos de conexão e ícones                         |

## 🏗️ Estrutura do projeto

```
web/
├── src/
│   ├── components/
│   │   ├── composites/       # Componentes reutilizáveis (sidebar, filtros, etc.)
│   │   └── ui/               # Componentes base (shadcn/ui + Radix)
│   ├── contexts/
│   │   ├── auth-context.tsx  # Contexto de autenticação
│   │   └── theme-context.tsx # Contexto de tema (claro/escuro)
│   ├── hooks/                # Hooks customizados
│   ├── lib/                  # Utilitários e constantes
│   ├── pages/
│   │   ├── login/            # Página de login
│   │   ├── register/         # Página de cadastro
│   │   └── dashboard/
│   │       ├── connections/  # CRUD de conexões
│   │       ├── contacts/     # CRUD de contatos
│   │       └── messages/     # CRUD de mensagens + agendamento
│   ├── services/             # Camada de dados (Firestore CRUD)
│   ├── types/                # Tipos TypeScript
│   └── utils/                # Funções utilitárias
functions/
└── src/
    └── index.ts              # Cloud Function de processamento de mensagens
```

## 🚢 Deploy

```bash
# Frontend
cd web && npm run build
firebase deploy --only hosting

# Functions
cd functions && npm run build
firebase deploy --only functions

# Firestore rules
firebase deploy --only firestore:rules

# Tudo de uma vez
firebase deploy
```

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico para processo seletivo.
