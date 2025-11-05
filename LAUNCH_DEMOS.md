# 🚀 Comment Lancer les Démos

## Méthode 1 : Serveur Bun (Recommandé ⚡)

### Prérequis
- Bun installé (voir ci-dessous)

### Démarrage

```bash
# Démarrer le serveur
bun run dev
```

Puis ouvrez **http://localhost:3000** dans votre navigateur !

Vous verrez un menu avec **toutes les démos** :

### 📺 Démos HTML
- **Minimal Demo** - Ultra-simple (30 lignes)
- **Simple Demo** - Interactive avec tous les agents
- **Local Demo** - Version robuste avec gestion d'erreurs
- **Original Demo** - Zoo d'agents (démo originale)

### 🎨 Exemples Code
- **Plugin TypeScript Simple** - Utilisation sans framework
- **Vue 3 Composable** - Exemple complet Vue 3
- **Vanilla JavaScript Avancé** - Tous les contrôles

---

## Méthode 2 : Ouvrir Directement (Sans Serveur)

Vous pouvez simplement ouvrir les fichiers HTML dans votre navigateur :

### Sur macOS
```bash
open minimal-demo.html
open simple-demo.html
open local-demo.html
```

### Sur Linux
```bash
xdg-open minimal-demo.html
xdg-open simple-demo.html
xdg-open local-demo.html
```

### Sur Windows
```bash
start minimal-demo.html
start simple-demo.html
start local-demo.html
```

Ou **double-cliquez** directement sur les fichiers !

---

## 🥟 Installation de Bun (si pas déjà fait)

### macOS / Linux / WSL
```bash
curl -fsSL https://bun.sh/install | bash
```

### Vérifier l'installation
```bash
bun --version
```

### Installer les dépendances du projet
```bash
bun install
```

---

## 📁 Structure des Démos

```
clippyjs/
├── minimal-demo.html         ← Ultra-simple
├── simple-demo.html          ← Interactive
├── local-demo.html           ← Robuste
├── demo/index.html           ← Original
│
└── examples/
    ├── typescript/           ← Plugin TS simple
    │   └── index.html
    ├── vue3/                 ← Vue 3 composable
    │   └── index.html
    └── vanilla/              ← Vanilla avancé
        └── index.html
```

---

## 🎯 Quelle Démo Choisir ?

### Je veux juste voir Clippy rapidement
→ `minimal-demo.html` (double-clic)

### Je veux tester tous les agents
→ `bun run dev` puis `/simple` sur http://localhost:3000

### Je veux utiliser dans mon projet Vue 3
→ `bun run dev` puis `/example/vue3`

### Je veux utiliser comme plugin TypeScript
→ `bun run dev` puis `/example/typescript`

---

## ⚡ Commandes Utiles

```bash
# Démarrer le serveur de dev
bun run dev

# Builder le projet
bun run build

# Type checking
bun run type-check

# Nettoyer
bun run clean
```

---

## 🐛 Problèmes ?

### Le serveur ne démarre pas
```bash
# Vérifier Bun
bun --version

# Vérifier le port 3000
lsof -i :3000
```

### Les agents ne se chargent pas
Vérifiez que `assets/agents/` existe :
```bash
ls -la assets/agents/
```

Vous devez voir 10 dossiers : Clippy, Merlin, Bonzi, F1, Genie, Genius, Links, Peedy, Rocky, Rover

---

## 📚 Documentation Complète

- **[QUICKSTART.md](QUICKSTART.md)** - Guide rapide
- **[BUN_GUIDE.md](BUN_GUIDE.md)** - Guide Bun complet
- **[TYPESCRIPT_README.md](TYPESCRIPT_README.md)** - API TypeScript
- **[DEMOS_README.md](DEMOS_README.md)** - Guide des démos HTML

---

## ✨ C'est Parti !

**La commande la plus simple :**

```bash
bun run dev
```

**Puis ouvrez :** http://localhost:3000

**Ou simplement :**

```bash
open minimal-demo.html
```

🎉 **Amusez-vous bien avec Clippy !**
