# 🚀 Guide de Démarrage Rapide

## 1️⃣ Installer Bun (si pas déjà fait)

```bash
# Installation Bun (macOS, Linux, WSL)
curl -fsSL https://bun.sh/install | bash

# Vérifier l'installation
bun --version
```

## 2️⃣ Lancer les Démos

### Option A : Serveur de Dev Bun (Recommandé ⚡)

```bash
# Démarrer le serveur
bun run dev
```

Puis ouvrez votre navigateur sur **http://localhost:3000**

Vous verrez un menu avec toutes les démos disponibles :
- **Minimal Demo** - Démo ultra-simple
- **Simple Demo** - Démo interactive
- **Local Demo** - Version locale robuste
- **Original Demo** - Zoo d'agents
- **Vanilla Example** - Exemple TypeScript

### Option B : Ouvrir directement dans le navigateur

Vous pouvez aussi ouvrir les fichiers HTML directement :

```bash
# Ouvrir dans le navigateur par défaut
open minimal-demo.html     # macOS
xdg-open minimal-demo.html # Linux
start minimal-demo.html    # Windows
```

Ou double-cliquez sur :
- `minimal-demo.html`
- `simple-demo.html`
- `local-demo.html`

## 🎨 Démos Disponibles

### 1. Minimal Demo (`minimal-demo.html`)
**La plus simple - 30 lignes de code**

Charge Clippy automatiquement et affiche un message.

**Parfait pour :** Comprendre les bases

### 2. Simple Demo (`simple-demo.html`)
**Version interactive complète**

- Sélecteur de 10 agents
- Boutons de contrôle (Afficher, Cacher, Parler, Animer)
- Interface stylisée

**Parfait pour :** Tester tous les agents et fonctionnalités

### 3. Local Demo (`local-demo.html`)
**Version robuste avec gestion d'erreurs**

- Meilleure gestion d'erreurs
- Messages de statut détaillés
- Fallbacks pour les problèmes de chargement

**Parfait pour :** Production ou environnement avec restrictions

### 4. Original Demo (`demo/index.html`)
**Zoo d'agents - démo originale**

Charge tous les agents successivement et les anime.

**Parfait pour :** Voir tous les agents en action

## 📝 Développement TypeScript

### Build le projet

```bash
# Build une fois
bun run build

# Le résultat est dans dist/
ls -la dist/
```

### Type checking

```bash
# Vérifier les types sans compiler
bun run type-check
```

### Tests

```bash
# Run tests (quand ils seront ajoutés)
bun test
```

## 💡 Utiliser dans votre projet

### 1. Import depuis les sources (Bun uniquement)

```typescript
// Pas besoin de build avec Bun !
import { clippy } from './src/index.ts';

const agent = await clippy.load('Clippy');
await agent.show();
await agent.speak('Hello!');
```

### 2. Import depuis le build (compatible partout)

```typescript
// Après avoir run "bun run build"
import { clippy } from './dist/index.js';

const agent = await clippy.load('Clippy');
await agent.show();
```

## 🎯 Commandes Essentielles

```bash
# Démarrer le serveur de dev
bun run dev

# Build le projet
bun run build

# Type checking
bun run type-check

# Nettoyer le dossier dist
bun run clean
```

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# Vérifier que Bun est installé
bun --version

# Vérifier qu'aucun autre serveur n'utilise le port 3000
lsof -i :3000
```

### Les agents ne se chargent pas

Les démos utilisent les assets locaux dans `./assets/agents/`

Vérifiez que le dossier existe :
```bash
ls -la assets/agents/
```

Vous devriez voir 10 dossiers (Clippy, Merlin, Bonzi, etc.)

### Erreurs TypeScript

```bash
# Installer les types Bun
bun add -d @types/bun

# Run le type checker
bun run type-check
```

## 📚 Documentation Complète

- **[BUN_GUIDE.md](BUN_GUIDE.md)** - Guide complet Bun
- **[TYPESCRIPT_README.md](TYPESCRIPT_README.md)** - API TypeScript
- **[DEMOS_README.md](DEMOS_README.md)** - Guide des démos
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Vue d'ensemble

## ⚡ C'est Parti !

La commande la plus simple pour commencer :

```bash
bun run dev
```

Puis ouvrez **http://localhost:3000** dans votre navigateur ! 🎉
