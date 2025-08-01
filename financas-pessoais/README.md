# 💰 Gestão de Finanças Pessoais

Um aplicativo web moderno para gerenciar suas receitas e despesas pessoais, construído com React, Firebase e Tailwind CSS.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação segura** com Google Firebase
- **CRUD completo** para transações financeiras
- **Isolamento de dados** por usuário
- **Resumo financeiro** em tempo real (receitas, despesas, saldo)
- **Filtros avançados** por tipo, categoria, data e descrição
- **Interface responsiva** otimizada para mobile
- **PWA** - Pode ser instalado como app nativo
- **Validações** completas em todos os formulários
- **Confirmações** antes de excluir dados

### 📊 Resumo Financeiro
- Total de receitas em tempo real
- Total de despesas em tempo real
- Cálculo automático do saldo atual
- Indicadores visuais coloridos

### 🎯 Categorias Disponíveis
- Alimentação, Transporte, Saúde, Educação
- Lazer, Casa, Roupas, Salário
- Freelance, Investimentos, Outros

## 🛠️ Tecnologias

- **Frontend**: React 18 + Vite
- **Estilização**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Autenticação**: Firebase Authentication (Google)
- **Ícones**: Lucide React
- **PWA**: Manifest + Service Worker

## 🔧 Setup do Projeto

### 1. Pré-requisitos
- Node.js 16+ instalado
- Conta Google para Firebase
- Editor de código (VSCode recomendado)

### 2. Clone e Instalação
```bash
git clone <seu-repositorio>
cd financas-pessoais
npm install
```

### 3. Configuração do Firebase

#### 3.1 Criando o Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nome: `financas-pessoais-[seunome]`
4. Desabilite Google Analytics
5. Clique em "Criar projeto"

#### 3.2 Configurando Authentication
1. No Firebase Console, vá em **Authentication**
2. Clique em "Começar"
3. Aba "Sign-in method" → Google
4. Ative o provedor Google
5. Selecione email de suporte
6. Salvar

#### 3.3 Configurando Firestore
1. No Firebase Console, vá em **Firestore Database**
2. "Criar banco de dados"
3. "Começar no modo de teste"
4. Escolha localização: `southamerica-east1` (São Paulo)
5. Concluir

#### 3.4 Configuração do App Web
1. Firebase Console → Visão geral → Ícone `</>`
2. Nome do app: `financas-web`
3. NÃO marcar Firebase Hosting
4. Registrar app
5. **COPIE** as configurações mostradas

#### 3.5 Arquivo de Configuração
Edite `src/firebase/config.js` e substitua pelas suas configurações:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};
```

### 4. Executar o Projeto
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📱 PWA (Progressive Web App)

O aplicativo é configurado como PWA e pode ser instalado:

### Desktop (Chrome)
1. Ícone de instalação na barra de endereços
2. Ou Configurações → Instalar aplicativo

### Mobile
1. Menu do navegador → "Adicionar à tela inicial"
2. Ou prompt automático de instalação

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Cabeçalho com perfil e logout
│   ├── FinancialSummary.jsx  # Resumo financeiro
│   ├── TransactionForm.jsx   # Formulário de transações
│   ├── TransactionList.jsx   # Lista de transações
│   └── Filters.jsx     # Filtros de busca
├── pages/              # Páginas principais
│   ├── Login.jsx       # Página de login
│   └── Dashboard.jsx   # Dashboard principal
├── hooks/              # Hooks customizados
│   └── useTransactions.js  # Gerencia transações
├── context/            # Contextos React
│   └── AuthContext.jsx # Estado de autenticação
├── firebase/           # Configurações Firebase
│   └── config.js       # Setup do Firebase
└── utils/              # Utilitários
```

## 💾 Estrutura de Dados

### Coleção `users`
```javascript
{
  id: "user_uid_google",
  name: "Nome do Usuário",
  email: "email@exemplo.com",
  photoURL: "url_foto_google",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Coleção `transactions`
```javascript
{
  id: "auto_generated_id",
  userId: "user_uid_google",
  type: "receita" | "despesa",
  description: "Descrição da transação",
  amount: 100.50,
  category: "Alimentação",
  date: "2024-01-15",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔒 Segurança

- **Isolamento de dados**: Cada usuário vê apenas suas transações
- **Autenticação obrigatória**: Todas as rotas protegidas
- **Validação no frontend**: Todos os campos obrigatórios
- **Firebase Rules**: Regras de segurança no Firestore

## 📋 Como Usar

### 1. Login
- Clique em "Continuar com Google"
- Autorize o aplicativo
- Será redirecionado para o dashboard

### 2. Adicionar Transação
- Clique em "Nova Transação"
- Preencha todos os campos obrigatórios
- Escolha receita ou despesa
- Clique em "Criar"

### 3. Editar Transação
- Clique no ícone de edição (lápis)
- Modifique os dados desejados
- Clique em "Atualizar"

### 4. Excluir Transação
- Clique no ícone de lixeira
- Confirme a exclusão

### 5. Filtrar Transações
- Use a busca por descrição
- Filtre por tipo (receita/despesa)
- Filtre por categoria
- Filtre por período de datas
- Clique em "Limpar filtros" para resetar

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu GitHub ao Vercel
2. Importe o repositório
3. Configure variáveis de ambiente:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.
4. Deploy automático

### Netlify
1. Conecte GitHub ao Netlify
2. Configure build command: `npm run build`
3. Publish directory: `dist`
4. Configure variáveis de ambiente
5. Deploy

## 🐛 Troubleshooting

### Firebase não conecta
- Verifique se copiou as configurações corretamente
- Confirme se Authentication e Firestore estão ativos
- Verifique console do navegador para erros

### Transações não aparecem
- Verifique se está logado com o usuário correto
- Confirme se as regras do Firestore permitem leitura
- Verifique se há transações criadas

### PWA não instala
- Verifique se está usando HTTPS (ou localhost)
- Confirme se manifest.json está acessível
- Veja se há erros no console do DevTools

## 📚 Recursos Úteis

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)

## 🏆 Funcionalidades Avançadas (Futuras)

- [ ] Gráficos e relatórios
- [ ] Exportação de dados (PDF, Excel)
- [ ] Categorias personalizadas
- [ ] Modo escuro
- [ ] Notificações push
- [ ] Backup automático
- [ ] Sincronização offline

## 📄 Licença

Este projeto é para fins educacionais.

---

Desenvolvido com ❤️ usando React + Firebase
