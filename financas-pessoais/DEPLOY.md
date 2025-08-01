# 🚀 Guia de Deploy - Vercel

Este guia te ajudará a fazer o deploy do seu projeto de gestão de finanças no Vercel.

## 📋 Pré-requisitos

- [ ] Projeto Firebase configurado e funcionando
- [ ] Código funcionando localmente
- [ ] Conta no GitHub
- [ ] Conta no Vercel

## 🔗 Passo 1: Conectar GitHub

### 1.1 Criar Repositório
```bash
# Inicializar git
git init
git add .
git commit -m "feat: projeto inicial de gestão de finanças"

# Conectar ao GitHub
git remote add origin https://github.com/seu-usuario/financas-pessoais.git
git branch -M main
git push -u origin main
```

### 1.2 Verificar Arquivos
Certifique-se que estes arquivos estão no repositório:
- ✅ `src/firebase/config.js` (com variáveis de ambiente)
- ✅ `.env.example` (exemplo das variáveis)
- ✅ `manifest.json` (configuração PWA)
- ✅ `README.md` (documentação)

## 🌐 Passo 2: Deploy no Vercel

### 2.1 Conectar Repositório
1. Acesse [Vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione seu repositório `financas-pessoais`
5. Clique em "Import"

### 2.2 Configurar Build
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Configurar Variáveis de Ambiente
Na tela de deploy, clique em "Environment Variables" e adicione:

```env
VITE_FIREBASE_API_KEY = sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN = seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET = seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
VITE_FIREBASE_APP_ID = sua-app-id
```

### 2.4 Finalizar Deploy
1. Clique em "Deploy"
2. Aguarde o build completar (1-3 minutos)
3. Acesse a URL fornecida

## 🔧 Passo 3: Configurar Firebase para Produção

### 3.1 Domínios Autorizados
1. Firebase Console → Authentication → Settings
2. "Authorized domains"
3. Adicione seu domínio Vercel: `seu-app.vercel.app`

### 3.2 Regras do Firestore
1. Firebase Console → Firestore Database → Rules
2. Substitua pelas regras do arquivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Clique em "Publish"

## ✅ Passo 4: Testar em Produção

### 4.1 Checklist de Testes
- [ ] Login com Google funciona
- [ ] Criar nova transação
- [ ] Editar transação existente
- [ ] Excluir transação
- [ ] Filtros funcionam
- [ ] Resumo financeiro atualiza
- [ ] Logout funciona
- [ ] PWA pode ser instalado
- [ ] Responsivo no mobile

### 4.2 PWA no Mobile
1. Acesse pelo Chrome mobile
2. Menu → "Instalar app"
3. Confirme instalação
4. Teste funcionalidades offline

## 🔄 Atualizações Automáticas

### 4.1 Deploy Contínuo
Cada push para a branch `main` fará deploy automático:

```bash
# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### 4.2 Preview Branches
Branches diferentes de `main` geram preview URLs:

```bash
# Criar branch para feature
git checkout -b feature/nova-funcionalidade
# ... fazer alterações ...
git push origin feature/nova-funcionalidade
```

## 🐛 Troubleshooting

### Deploy Falha
```bash
# Ver logs detalhados
npm run build
# Se falhar localmente, corrigir antes do deploy
```

### Firebase não Conecta
1. Verificar variáveis de ambiente no Vercel
2. Confirmar domínio autorizado no Firebase
3. Verificar console do navegador

### PWA não Instala
1. Verificar HTTPS (Vercel usa por padrão)
2. Confirmar manifest.json acessível
3. DevTools → Application → Manifest

## 📱 URLs Importantes

Após o deploy, você terá:
- **App Principal**: https://seu-app.vercel.app
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com

## 🎯 Próximos Passos

1. [ ] Personalizar domínio (opcional)
2. [ ] Configurar analytics (opcional)
3. [ ] Adicionar mais funcionalidades
4. [ ] Fazer backup regular do Firestore

---

🎉 **Parabéns!** Seu app está no ar e funcionando!

Envie o link para: durvaldo.marques@prozeducacao.com.br