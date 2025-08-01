# 💰 Finantech - Gestão Pessoal de Finanças

Uma aplicação web moderna e intuitiva para gerenciamento de finanças pessoais, construída com React, Vite, TailwindCSS e Firebase.

## 📋 Índice

- [Recursos](#-recursos)
- [Setup Inicial](#-setup-inicial)
- [Troubleshooting](#-troubleshooting)
- [Todo List por Fases](#-todo-list-por-fases)
- [Guia PWA](#-guia-pwa)
- [Guias Extras](#-guias-extras)

## ✨ Recursos

- 🔐 **Autenticação Firebase** (Google OAuth)
- 💸 **Gestão de Transações** (Receitas e Despesas)
- 📊 **Dashboard com Resumo Financeiro**
- 🔍 **Sistema de Filtros Avançado**
- 📱 **PWA Ready** (Progressive Web App)
- 🎨 **Interface Moderna** com TailwindCSS
- ⚡ **Performance Otimizada** com Vite
- 📱 **Totalmente Responsivo**

## 🚀 Setup Inicial

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18+) - [Download aqui](https://nodejs.org/)
- **npm** ou **yarn** (vem com Node.js)
- **Git** - [Download aqui](https://git-scm.com/)
- **Conta Firebase** - [Console Firebase](https://console.firebase.google.com/)

### Passo 1: Clone do Repositório

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre na pasta do projeto
cd finantech

# Verificar se está na pasta correta
pwd
```

### Passo 2: Instalação de Dependências

```bash
# Instalar dependências
npm install

# OU se preferir yarn
yarn install

# Verificar se instalou corretamente
npm list --depth=0
```

**Dependências principais:**
- `react` (^19.1.0) - Framework principal
- `firebase` (^12.0.0) - Backend e autenticação
- `tailwindcss` (^4.1.11) - Estilização
- `react-hot-toast` (^2.5.2) - Notificações
- `vite` (^6.3.5) - Build tool

### Passo 3: Configuração do Firebase

#### 3.1 Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome: `seu-projeto-financas`
4. Habilite Google Analytics (opcional)
5. Clique em "Criar projeto"

#### 3.2 Configurar Authentication

1. No painel lateral, clique em **Authentication**
2. Clique em **Começar**
3. Vá para aba **Sign-in method**
4. Habilite **Google** como provedor
5. Configure o email de suporte do projeto
6. Salve as configurações

#### 3.3 Configurar Firestore Database

1. No painel lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Começar no modo de teste** (para desenvolvimento)
4. Selecione uma localização (preferencialmente `southamerica-east1`)
5. Clique em **Concluído**

#### 3.4 Configurar regras de segurança

No Firestore, vá para **Regras** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir apenas usuários autenticados acessarem suas próprias transações
    match /transacoes/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### 3.5 Obter configurações do projeto

1. No painel do Firebase, clique no ícone de **configurações** (⚙️)
2. Vá para **Configurações do projeto**
3. Na seção **Seus apps**, clique em **Web** (`</>`)
4. Registre seu app com um apelido
5. Copie o objeto `firebaseConfig`

#### 3.6 Configurar variáveis do projeto

**Opção A: Usar arquivo atual (DESENVOLVIMENTO)**

Edite `src/firebase/config.js` com suas configurações:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

**Opção B: Usar variáveis de ambiente (PRODUÇÃO)**

1. Crie arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Modifique `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

### Passo 4: Executar o Projeto

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# OU
yarn dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Passo 5: Verificar Funcionamento

1. **Abra o navegador** em `http://localhost:5173`
2. **Teste o login** com sua conta Google
3. **Adicione uma transação** de teste
4. **Teste os filtros** criados
5. **Verifique o dashboard** com resumo financeiro

## 🔧 Troubleshooting

### Problemas Comuns e Soluções

#### 1. Erro: "Module not found"

**Problema:** Dependências não instaladas corretamente
```bash
Error: Cannot find module 'react' or its corresponding type declarations
```

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version  # Deve ser 18+
```

#### 2. Erro de Firebase Authentication

**Problema:** "Firebase: Error (auth/configuration-not-found)"

**Solução:**
1. Verificar se as configurações do Firebase estão corretas
2. Confirmar se Authentication está habilitado no console
3. Verificar se o domínio está autorizado:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Adicionar `localhost` se não estiver

#### 3. Erro de CORS no Firebase

**Problema:** Blocked by CORS policy

**Solução:**
```bash
# Instalar Firebase CLI se não tiver
npm install -g firebase-tools

# Fazer login
firebase login

# Configurar hosting (opcional)
firebase init hosting
```

#### 4. TailwindCSS não carregando

**Problema:** Estilos não aparecem

**Solução:**
1. Verificar se o plugin está no `vite.config.js`:
```javascript
import tailwindcss from '@tailwindcss/vite';
```

2. Verificar `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 5. Build de produção falhando

**Problema:** Erro no `npm run build`

**Solução:**
```bash
# Verificar se tem erros de lint
npm run lint

# Build com mais informações
npm run build -- --verbose

# Verificar se todas as variáveis de ambiente estão definidas
echo $VITE_FIREBASE_API_KEY
```

#### 6. PWA não funcionando

**Problema:** App não instala como PWA

**Solução:**
1. Verificar se `manifest.json` está acessível
2. Usar HTTPS (obrigatório para PWA)
3. Verificar console do navegador para erros de Service Worker

#### 7. Firestore permissions denied

**Problema:** "Missing or insufficient permissions"

**Solução:**
```javascript
// Verificar regras no Firebase Console
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transacoes/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Logs úteis para Debug

```bash
# Verificar logs do Vite
npm run dev -- --debug

# Verificar versões
npm list react firebase vite

# Verificar configuração do Firebase
firebase projects:list

# Limpar cache do navegador
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
```

## 📋 Todo List por Fases

### 🏗️ Fase 1: Setup e Base (CONCLUÍDO)

- [x] **Configuração inicial do projeto**
  - [x] Setup Vite + React
  - [x] Configuração TailwindCSS
  - [x] Setup Firebase
  - [x] Configuração de autenticação

- [x] **Estrutura base**
  - [x] Componentes de autenticação (Login)
  - [x] Context de autenticação
  - [x] Rotas protegidas
  - [x] Layout responsivo

### 💰 Fase 2: Core Financeiro (CONCLUÍDO)

- [x] **Gestão de transações**
  - [x] Formulário de criação/edição
  - [x] Lista de transações
  - [x] Exclusão de transações
  - [x] Validações de formulário

- [x] **Dashboard financeiro**
  - [x] Resumo de receitas
  - [x] Resumo de despesas
  - [x] Cálculo de saldo
  - [x] Cards informativos

### 🔍 Fase 3: Filtros e Busca (CONCLUÍDO)

- [x] **Sistema de filtros**
  - [x] Filtro por tipo (receita/despesa)
  - [x] Filtro por categoria
  - [x] Filtro por mês
  - [x] Botão toggle para mostrar/esconder filtros
  - [x] Limpeza de filtros

### 📊 Fase 4: Relatórios e Analytics (EM DESENVOLVIMENTO)

- [ ] **Gráficos e visualizações**
  - [ ] Gráfico de pizza (receitas vs despesas)
  - [ ] Gráfico de linha (evolução mensal)
  - [ ] Gráfico de barras (por categoria)
  - [ ] Exportação para PDF/Excel

- [ ] **Relatórios avançados**
  - [ ] Relatório mensal detalhado
  - [ ] Comparativo entre períodos
  - [ ] Projeções futuras
  - [ ] Alertas de gastos

### 🎨 Fase 5: UX/UI Melhorias (PLANEJADO)

- [ ] **Interface aprimorada**
  - [ ] Modo escuro/claro
  - [ ] Animações de transição
  - [ ] Skeleton loading
  - [ ] Estados vazios melhorados

- [ ] **Experiência móvel**
  - [ ] Gestos de swipe
  - [ ] Navegação por abas
  - [ ] Teclado numérico otimizado
  - [ ] Haptic feedback

### 🔐 Fase 6: Segurança e Performance (PLANEJADO)

- [ ] **Segurança**
  - [ ] Validação de dados no backend
  - [ ] Rate limiting
  - [ ] Backup automático
  - [ ] Criptografia adicional

- [ ] **Performance**
  - [ ] Lazy loading de componentes
  - [ ] Otimização de imagens
  - [ ] Service Worker para cache
  - [ ] Compressão de assets

### 🚀 Fase 7: Funcionalidades Avançadas (FUTURO)

- [ ] **Recursos premium**
  - [ ] Categorias customizáveis
  - [ ] Metas de economia
  - [ ] Lembretes de pagamento
  - [ ] Sincronização bancária

- [ ] **Integrações**
  - [ ] Notificações push
  - [ ] Compartilhamento social
  - [ ] API para terceiros
  - [ ] Widgets de desktop

## 📱 Guia PWA

### O que é uma PWA?

Progressive Web Apps (PWAs) são aplicações web que oferecem experiência similar a apps nativos, com recursos como:

- ⚡ **Carregamento rápido**
- 📱 **Instalação na tela inicial**
- 🔄 **Funcionamento offline**
- 🔔 **Notificações push**
- 📐 **Interface responsiva**

### Configuração PWA (JÁ IMPLEMENTADA)

O projeto já possui configuração PWA básica:

#### 1. Manifest (`public/manifest.json`)

```json
{
  "name": "Finantech - Gestão Pessoal",
  "short_name": "Finantech",
  "description": "Gerencie suas finanças pessoais de forma simples e segura",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary"
}
```

#### 2. Meta tags PWA (`index.html`)

```html
<meta name="theme-color" content="#3b82f6" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

### Melhorando a PWA

#### 1. Adicionar Service Worker

Crie `public/sw.js`:

```javascript
const CACHE_NAME = 'finantech-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

#### 2. Registrar Service Worker

Em `src/main.jsx`:

```javascript
// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

#### 3. Criar ícones PWA

Crie ícones nos tamanhos:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-144.png` (144x144)
- `apple-touch-icon.png` (180x180)

#### 4. Testar PWA

```bash
# Build para produção
npm run build

# Servir build local
npm run preview

# Ou usar serve
npx serve dist
```

**Teste no Chrome:**
1. Abra DevTools (F12)
2. Vá para aba **Application**
3. Clique em **Manifest** (verificar configurações)
4. Clique em **Service Workers** (verificar registro)
5. Em **Lighthouse**, rode audit de PWA

### Deploy PWA

#### Opção 1: Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Build e deploy
npm run build
firebase deploy
```

#### Opção 2: Netlify

```bash
# Build
npm run build

# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Opção 3: Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🎯 Guias Extras

### 🧪 Testes

#### Setup Jest + Testing Library

```bash
# Instalar dependências
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Criar jest.config.js
touch jest.config.js
```

#### Exemplo de teste

```javascript
// src/components/__tests__/Login.test.jsx
import { render, screen } from '@testing-library/react';
import Login from '../Login';

test('renders login button', () => {
  render(<Login />);
  const loginButton = screen.getByText(/entrar com google/i);
  expect(loginButton).toBeInTheDocument();
});
```

### 🐳 Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yaml
version: '3.8'
services:
  finantech:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

### 🔄 CI/CD com GitHub Actions

#### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: seu-projeto-id
```

### 📊 Analytics

#### Google Analytics 4

```javascript
// src/utils/analytics.js
import { getAnalytics, logEvent } from 'firebase/analytics';
import app from '../firebase/config';

const analytics = getAnalytics(app);

export const trackEvent = (eventName, parameters = {}) => {
  logEvent(analytics, eventName, parameters);
};

// Usar nos componentes
trackEvent('transaction_created', {
  type: 'receita',
  value: 100
});
```

### 🔐 Segurança Avançada

#### Regras Firestore Avançadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transações
    match /transacoes/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId &&
        isValidTransaction(request.resource.data);
    }
    
    // Categorias personalizadas
    match /categorias/{categoryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
  
  function isValidTransaction(data) {
    return data.keys().hasAll(['descricao', 'valor', 'tipo', 'categoria']) &&
           data.valor is number &&
           data.valor > 0 &&
           data.tipo in ['receita', 'despesa'];
  }
}
```

### 🌐 Internacionalização (i18n)

```bash
# Instalar react-i18next
npm install react-i18next i18next

# Configurar idiomas
mkdir src/locales
touch src/locales/pt.json src/locales/en.json
```

### 📱 Notificações Push

```javascript
// src/utils/notifications.js
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options
    });
  }
};
```

---

## 📞 Suporte

Se encontrar problemas não listados no troubleshooting:

1. **Verifique os logs** do console do navegador
2. **Consulte a documentação** do Firebase
3. **Abra uma issue** no repositório
4. **Contate o suporte** através do email

---

**Desenvolvido com ❤️ para gestão financeira pessoal**
