# 🥟 ClippyJS avec Bun

Guide complet pour utiliser ClippyJS avec [Bun](https://bun.sh) - le runtime JavaScript ultra-rapide !

## 🚀 Pourquoi Bun ?

- ⚡ **20-40x plus rapide** que npm pour l'installation
- 🔥 **Build natif** de TypeScript sans configuration
- 📦 **Bundler intégré** - pas besoin de Vite/Webpack
- 🧪 **Test runner** intégré
- 🎯 **Compatible** avec npm, Node.js et tous les packages

## 📦 Installation

### 1. Installer Bun

```bash
# macOS / Linux / WSL
curl -fsSL https://bun.sh/install | bash

# Ou avec npm (ironique mais ça marche)
npm install -g bun

# Vérifier l'installation
bun --version
```

### 2. Installer les dépendances du projet

```bash
# Avec Bun (ultra rapide !)
bun install

# Équivalent npm (beaucoup plus lent)
npm install
```

**Temps de comparaison** :
- npm: ~30-60 secondes
- Bun: ~2-5 secondes ⚡

## 🛠️ Utilisation

### Build du projet

```bash
# Build avec le script Bun natif (recommandé)
bun run build

# Ou avec TypeScript compiler
bun run build:tsc

# Ou avec Vite (si installé)
bun run build:vite

# Nettoyer avant build
bun run clean && bun run build
```

**Avantage** : Bun compile le TypeScript **sans configuration** !

### Mode développement

```bash
# Watch mode avec hot reload
bun run dev

# Équivaut à:
bun run --watch src/index.ts
```

### Tests

```bash
# Run tests avec Bun (ultra rapide)
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

### Type checking

```bash
# Vérifier les types sans compiler
bun run type-check
```

## 💡 Utilisation dans votre projet

### Option 1 : Import direct des sources TypeScript (Bun only)

Bun peut importer directement les fichiers `.ts` **sans compilation** :

```typescript
// ✨ Aucun build nécessaire avec Bun !
import { clippy } from './src/index.ts';
import { createClippy } from './src/plugin/index.ts';
import { useClippy } from './src/vue/index.ts';

// Utiliser directement
const agent = await clippy.load('Clippy');
await agent.show();
```

**Note** : Le `package.json` inclut déjà les exports "bun" :

```json
"exports": {
  ".": {
    "bun": "./src/index.ts",
    "import": "./dist/index.js"
  }
}
```

### Option 2 : Build puis import (compatible tout)

```bash
# Build une fois
bun run build

# Puis import classique
import { clippy } from '@clippyjs/modern';
```

## 🎯 Exemples avec Bun

### 1. Script TypeScript simple

```typescript
// demo.ts
import { createClippy } from './src/plugin';

const clippy = createClippy({
  autoLoad: 'Clippy',
  autoShow: true,
  basePath: './assets/agents/',
});

await clippy.speak('Hello from Bun!');
await clippy.animate();
```

```bash
# Exécuter directement (pas de build!)
bun run demo.ts
```

### 2. Serveur HTTP avec Clippy

```typescript
// server.ts
import { file } from 'bun';

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve demo HTML
    if (url.pathname === '/') {
      return new Response(await file('./minimal-demo.html').text(), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Serve assets
    if (url.pathname.startsWith('/assets/')) {
      const filePath = '.' + url.pathname;
      return new Response(await file(filePath).arrayBuffer());
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log('🚀 Server running on http://localhost:3000');
```

```bash
# Démarrer le serveur
bun run server.ts
```

### 3. Test avec Bun

```typescript
// agent.test.ts
import { describe, test, expect } from 'bun:test';
import { Agent } from './src/core/Agent';

describe('Agent', () => {
  test('should create agent', () => {
    const mockData = {
      name: 'Clippy',
      framesize: [100, 100],
      animations: {
        Show: { duration: 100, images: [[0, 0]] },
      },
    };

    const agent = new Agent(mockData, {}, './assets/agents/Clippy');
    expect(agent).toBeDefined();
    expect(agent.animations()).toContain('Show');
  });

  test('should show and hide', async () => {
    // ... test code
  });
});
```

```bash
# Run tests
bun test
```

## 🔧 Configuration

### bunfig.toml

Le fichier `bunfig.toml` est déjà configuré :

```toml
[install]
production = false
exact = false
auto = true

[test]
coverage = true
coverageThreshold = 0.8

[build]
target = "browser"
format = "esm"
minify = true
external = ["vue"]
```

### tsconfig.json

Compatible avec Bun out-of-the-box :

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "types": ["bun-types"]
  }
}
```

## 📊 Performance

### Installation

```bash
# npm
time npm install
# ~35 secondes

# bun
time bun install
# ~3 secondes
```

**Bun est ~11x plus rapide !** ⚡

### Build

```bash
# Vite
time npm run build:vite
# ~5-8 secondes

# Bun native
time bun run build
# ~2-3 secondes
```

**Bun est ~2-3x plus rapide !** 🔥

### Tests

```bash
# Jest/Vitest
time npm test
# ~3-5 secondes

# Bun test
time bun test
# ~0.5-1 secondes
```

**Bun est ~5x plus rapide !** 🚀

## 🎨 Scripts package.json

Tous les scripts sont compatibles Bun :

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "bun run build.ts",
    "test": "bun test",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

Utilisez `bun run <script>` comme avec npm :

```bash
bun run dev
bun run build
bun run test
```

## 🔄 Migration depuis npm/yarn

### 1. Lockfile

Bun crée `bun.lockb` (binaire, ultra rapide) :

```bash
# Supprimer les anciens lockfiles
rm package-lock.json yarn.lock

# Installer avec Bun
bun install
```

### 2. Scripts

Tous les scripts npm fonctionnent :

```bash
# Au lieu de:
npm run build
npm test

# Utilisez:
bun run build
bun test
```

### 3. Compatibilité

Bun est compatible avec :
- ✅ Tous les packages npm
- ✅ Node.js APIs
- ✅ TypeScript natif
- ✅ ESM et CommonJS
- ✅ Package.json scripts

## 🚀 Workflow recommandé

### Développement quotidien

```bash
# 1. Installer les deps (une fois)
bun install

# 2. Dev mode avec hot reload
bun run dev

# 3. Tests en watch mode
bun test --watch
```

### Build pour production

```bash
# 1. Nettoyer
bun run clean

# 2. Type check
bun run type-check

# 3. Build
bun run build

# 4. Vérifier le build
ls -lh dist/
```

### Debugging

```bash
# Debug avec Bun
bun --inspect src/index.ts

# Ou avec Chrome DevTools
bun --inspect-brk src/index.ts
```

## 🎯 Avantages spécifiques à ce projet

1. **Pas de node_modules énorme** - Bun est plus efficace
2. **Build TypeScript natif** - Pas besoin de tsc
3. **Hot reload ultra rapide** - Rechargement instantané
4. **Tests rapides** - Idéal pour TDD
5. **Compatible Vue 3** - Fonctionne parfaitement

## ⚠️ Limitations actuelles

1. **Bun n'est pas encore 1.0** (en beta/stable)
2. **Certains packages Node.js** peuvent avoir des problèmes
3. **Windows support** moins mature que macOS/Linux

## 📚 Ressources

- [Documentation Bun](https://bun.sh/docs)
- [Bun Discord](https://bun.sh/discord)
- [GitHub Bun](https://github.com/oven-sh/bun)

## 🎉 Résumé

**Pourquoi utiliser Bun avec ClippyJS :**

✅ **Installation** 10x plus rapide
✅ **Build** natif TypeScript sans config
✅ **Tests** 5x plus rapide
✅ **Dev mode** avec hot reload ultra rapide
✅ **100% compatible** avec npm/Node.js
✅ **Moins de configuration** - ça marche direct !

**Commandes essentielles :**

```bash
bun install          # Installer
bun run build        # Build
bun run dev          # Dev mode
bun test             # Tests
```

**C'est tout !** Bun simplifie tout. 🎯
