# 🔧 Troubleshooting - Finantech

## Problemas Comuns e Soluções

### 🚨 Erros de Instalação

#### Erro: "npm ERR! peer dep missing"
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### Erro: "Node version not compatible"
```bash
# Verificar versão atual
node --version

# Instalar Node 18+ se necessário
# Windows: Baixar do site oficial
# Mac: brew install node@18
# Linux: nvm install 18
```

### 🔥 Erros do Firebase

#### "Firebase: Error (auth/configuration-not-found)"
**Causa:** Configuração do Firebase incorreta

**Solução:**
1. Verificar `src/firebase/config.js`
2. Confirmar credenciais no Firebase Console
3. Verificar se Authentication está habilitado
4. Adicionar domínio autorizado (localhost)

#### "Firebase: Error (auth/popup-blocked)"
**Causa:** Popup bloqueado pelo navegador

**Solução:**
1. Permitir popups para localhost
2. Testar em navegador privado
3. Verificar extensões que bloqueiam popups

#### "Firestore: Missing or insufficient permissions"
**Causa:** Regras de segurança incorretas

**Solução:**
```javascript
// No Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transacoes/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 🎨 Erros de Estilo

#### TailwindCSS não carrega
**Causa:** Configuração do Vite incorreta

**Solução:**
1. Verificar `vite.config.js`:
```javascript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

2. Verificar `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Estilos não aparecem em produção
**Causa:** Build de CSS incorreto

**Solução:**
```bash
# Limpar build anterior
rm -rf dist

# Build novamente
npm run build

# Verificar se CSS foi gerado
ls dist/assets/*.css
```

### ⚡ Erros de Performance

#### "Vite dev server slow"
**Causa:** Muitos arquivos ou dependências

**Solução:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase']
  }
});
```

#### Hot reload não funciona
**Causa:** Configuração de HMR incorreta

**Solução:**
```bash
# Reiniciar servidor
npm run dev

# Se persistir, limpar cache
rm -rf node_modules/.vite
npm run dev
```

### 📱 Erros de PWA

#### Manifest não carrega
**Causa:** Arquivo manifest.json incorreto

**Solução:**
1. Verificar syntax JSON em `public/manifest.json`
2. Confirmar meta tag no `index.html`:
```html
<link rel="manifest" href="/manifest.json" />
```

#### Service Worker não registra
**Causa:** HTTPS obrigatório para SW

**Solução:**
1. Em desenvolvimento: usar localhost (permitido)
2. Em produção: usar HTTPS
3. Verificar console para erros de SW

### 🌐 Erros de Deploy

#### Firebase deploy falha
**Causa:** Configuração ou build incorreto

**Solução:**
```bash
# Verificar login
firebase login

# Verificar projeto
firebase projects:list

# Build antes do deploy
npm run build
firebase deploy
```

#### Netlify/Vercel build falha
**Causa:** Variáveis de ambiente ausentes

**Solução:**
1. Configurar variáveis no painel:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.

2. Verificar build command:
   - Build: `npm run build`
   - Output: `dist`

### 🔍 Debugging

#### Console logs para debug
```javascript
// No componente com problema
console.log('State:', state);
console.log('Props:', props);
console.log('Firebase user:', currentUser);

// Para Firebase
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from './firebase/config';

// Verificar conexão
enableNetwork(db).then(() => {
  console.log('Firestore online');
});
```

#### React DevTools
1. Instalar extensão React DevTools
2. Abrir aba Components
3. Verificar state e props

#### Firebase DevTools
1. Abrir console Firebase
2. Verificar logs em tempo real
3. Testar regras no simulador

### 📋 Checklist de Debug

Quando algo não funciona:

1. **Verificar console do navegador**
   - [ ] Erros de JavaScript
   - [ ] Erros de rede
   - [ ] Warnings do React

2. **Verificar configurações**
   - [ ] Firebase config correto
   - [ ] Variáveis de ambiente
   - [ ] Regras do Firestore

3. **Verificar dependências**
   - [ ] npm list para conflitos
   - [ ] Versões compatíveis
   - [ ] Cache limpo

4. **Testar isoladamente**
   - [ ] Funciona em navegador privado?
   - [ ] Funciona em outro navegador?
   - [ ] Funciona com dados de teste?

### 🆘 Solução Drástica

Se nada funciona:

```bash
# Reset completo
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Se ainda não funcionar
git stash
git pull origin main
npm install
npm run dev
```

### 📞 Onde Buscar Ajuda

1. **Documentação oficial:**
   - [Vite](https://vitejs.dev/guide/troubleshooting.html)
   - [Firebase](https://firebase.google.com/docs/web/troubleshooting)
   - [React](https://react.dev/learn/troubleshooting)

2. **Comunidades:**
   - Stack Overflow
   - Discord do React
   - Reddit r/reactjs

3. **Logs específicos:**
   ```bash
   # Logs detalhados
   npm run dev -- --debug
   npm run build -- --verbose
   ```