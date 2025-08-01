# 📱 Guia Completo PWA - Finantech

## O que é uma PWA?

Progressive Web Apps (PWAs) são aplicações web que oferecem experiência nativa, com recursos como:

- 📱 **Instalação na tela inicial**
- ⚡ **Carregamento rápido**
- 🔄 **Funcionamento offline**
- 🔔 **Notificações push**
- 📐 **Design responsivo**
- 🔒 **Acesso seguro (HTTPS)**

## Status Atual do Projeto

✅ **Já implementado:**
- Manifest.json configurado
- Meta tags PWA
- Ícones básicos
- Design responsivo

🔄 **Para implementar:**
- Service Worker completo
- Cache estratégico
- Funcionalidade offline
- Notificações push

## Implementação Completa

### 1. Service Worker Avançado

Crie `public/sw.js`:

```javascript
const CACHE_NAME = 'finantech-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Arquivos essenciais para cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// URLs que devem ser sempre atualizadas
const NETWORK_FIRST = [
  '/api/',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com'
];

// Install event - cache arquivos estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => caches.delete(key))
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - estratégias de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorar requests que não são HTTP/HTTPS
  if (!request.url.startsWith('http')) return;
  
  // Estratégia Network First para APIs
  if (NETWORK_FIRST.some(url => request.url.includes(url))) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Estratégia Cache First para recursos estáticos
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Estratégia Stale While Revalidate para páginas
  event.respondWith(staleWhileRevalidate(request));
});

// Estratégias de cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache');
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache and network failed');
    return new Response('Resource not available', { status: 404 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Background sync para quando voltar online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  // Implementar sincronização de transações offline
  console.log('[SW] Syncing offline transactions...');
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Finantech', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
```

### 2. Registrar Service Worker

Modifique `src/main.jsx`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('SW registered:', registration);
      
      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            showUpdateNotification();
          }
        });
      });
      
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  });
}

function showUpdateNotification() {
  if (confirm('Nova versão disponível! Recarregar?')) {
    window.location.reload();
  }
}
```

### 3. Funcionalidade Offline

Crie `src/hooks/useOffline.js`:

```javascript
import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
      // Sincronizar dados quando voltar online
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-transactions');
        });
      }
    }
    
    function handleOffline() {
      setIsOffline(true);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOffline;
}
```

### 4. Indicador Offline

Crie `src/components/OfflineIndicator.jsx`:

```javascript
import React from 'react';
import { useOffline } from '../hooks/useOffline';

export default function OfflineIndicator() {
  const isOffline = useOffline();
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
      📶 Você está offline. Algumas funcionalidades podem estar limitadas.
    </div>
  );
}
```

### 5. Botão de Instalação PWA

Crie `src/components/InstallPWA.jsx`:

```javascript
import React, { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  
  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    }
    
    function handleAppInstalled() {
      setDeferredPrompt(null);
      setShowInstall(false);
      console.log('PWA foi instalada');
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };
  
  if (!showInstall) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Instalar Finantech</h3>
          <p className="text-sm opacity-90">Acesso rápido direto da tela inicial</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstall(false)}
            className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
          >
            Depois
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 text-sm bg-white text-blue-500 rounded hover:bg-gray-100"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 6. Notificações Push

Crie `src/utils/notifications.js`:

```javascript
// Solicitar permissão para notificações
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Notificações não suportadas');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Mostrar notificação local
export function showLocalNotification(title, options = {}) {
  if (Notification.permission !== 'granted') return;
  
  const notification = new Notification(title, {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    ...options
  });
  
  notification.onclick = function() {
    window.focus();
    notification.close();
  };
  
  return notification;
}

// Agendar notificação de lembrete
export function scheduleReminder(title, delay = 24 * 60 * 60 * 1000) {
  setTimeout(() => {
    showLocalNotification(title, {
      body: 'Não esqueça de registrar suas transações do dia!',
      tag: 'daily-reminder'
    });
  }, delay);
}
```

### 7. Atualizar Componentes

Modifique `src/App.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Lista from './components/Lista';
import Login from './components/Login';
import ToastContainer from './components/Toast';
import OfflineIndicator from './components/OfflineIndicator';
import InstallPWA from './components/InstallPWA';
import { requestNotificationPermission } from './utils/notifications';

function AppContent() {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Solicitar permissão para notificações quando logar
    if (currentUser) {
      requestNotificationPermission();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <>
      <OfflineIndicator />
      <Lista />
      <InstallPWA />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
```

## Teste da PWA

### 1. Build e Preview

```bash
# Build para produção
npm run build

# Servir localmente
npm run preview
# ou
npx serve dist
```

### 2. Teste no Chrome DevTools

1. Abra `http://localhost:4173`
2. Abra DevTools (F12)
3. Vá para aba **Application**
4. Verifique seções:
   - **Manifest**: Configurações PWA
   - **Service Workers**: SW registrado
   - **Storage**: Cache funcionando

### 3. Lighthouse Audit

1. Na aba **Lighthouse**
2. Selecione **Progressive Web App**
3. Clique em **Generate report**
4. Meta: Score 90+

### 4. Teste de Instalação

1. Chrome: Ícone + na barra de endereço
2. Edge: Botão "Instalar app"
3. Mobile: Banner "Adicionar à tela inicial"

## Deploy para Produção

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Configurar firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}

# Build e deploy
npm run build
firebase deploy
```

### Netlify

```bash
# Build
npm run build

# Deploy
npx netlify-cli deploy --prod --dir=dist

# Configurar _redirects
echo "/*    /index.html   200" > dist/_redirects
```

### Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configurar vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

## Checklist Final PWA

### ✅ Recursos Básicos
- [ ] Manifest.json válido
- [ ] Service Worker registrado
- [ ] HTTPS habilitado
- [ ] Design responsivo
- [ ] Ícones em múltiplos tamanhos

### ✅ Funcionalidades Avançadas
- [ ] Cache estratégico implementado
- [ ] Funcionalidade offline
- [ ] Indicador de status de rede
- [ ] Botão de instalação
- [ ] Notificações push

### ✅ Performance
- [ ] Score Lighthouse > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### ✅ Deploy
- [ ] Build otimizado
- [ ] HTTPS configurado
- [ ] Headers de cache corretos
- [ ] PWA testada em produção

## Recursos Adicionais

### Bibliotecas Úteis

```bash
# Workbox para SW avançado
npm install workbox-webpack-plugin

# React PWA utilities
npm install react-pwa-install-prompt

# Push notifications
npm install web-push
```

### Links de Referência

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)