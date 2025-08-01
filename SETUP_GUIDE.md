# 🚀 Guia de Setup Rápido - Finantech

## Checklist de Instalação

### ✅ Pré-requisitos
- [ ] Node.js 18+ instalado
- [ ] npm/yarn funcionando
- [ ] Git configurado
- [ ] Conta Firebase criada

### ✅ Setup do Projeto
```bash
# 1. Clone e instale
git clone <repo>
cd finantech
npm install

# 2. Configure Firebase
# - Crie projeto no Firebase Console
# - Habilite Authentication (Google)
# - Crie Firestore Database
# - Configure regras de segurança

# 3. Configure variáveis
# Edite src/firebase/config.js com suas credenciais

# 4. Execute
npm run dev
```

### ✅ Verificação Rápida
- [ ] `http://localhost:5173` carrega
- [ ] Login com Google funciona
- [ ] Criar transação funciona
- [ ] Filtros funcionam
- [ ] Dashboard mostra dados

## Comandos Essenciais

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código

# Firebase
firebase login       # Login no Firebase CLI
firebase deploy      # Deploy para produção
firebase projects:list # Listar projetos

# Troubleshooting
rm -rf node_modules package-lock.json && npm install  # Reset dependências
npm run dev -- --debug                                # Debug mode
```

## Estrutura de Pastas

```
finantech/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── icons/            # Ícones PWA
├── src/
│   ├── components/       # Componentes React
│   ├── contexts/         # Context API
│   ├── firebase/         # Configuração Firebase
│   └── utils/           # Utilitários
├── package.json
└── vite.config.js
```

## Links Importantes

- [Firebase Console](https://console.firebase.google.com/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Docs](https://react.dev/)