# 🚀 START HERE - Guide de Démarrage

## ⚡ 3 Façons de Lancer les Démos

### 1️⃣ Serveur Python (Recommandé - Fonctionne partout)

```bash
# Démarrer le serveur
python3 server.py

# Ou avec npm script
npm run dev:python
```

Puis ouvrez **http://localhost:3000** dans votre navigateur !

### 2️⃣ Ouvrir Directement (Sans serveur)

Vous pouvez simplement **double-cliquer** sur :
- `minimal-demo.html`
- `simple-demo.html`
- `local-demo.html`

Ou en ligne de commande :
```bash
# Linux/macOS
xdg-open minimal-demo.html
open minimal-demo.html

# Windows
start minimal-demo.html
```

### 3️⃣ Avec Bun (Si installé)

```bash
# Installer Bun
curl -fsSL https://bun.sh/install | bash

# Démarrer
bun run dev
```

---

## 📺 Démos Disponibles

Quand le serveur tourne (http://localhost:3000), vous avez accès à :

### Démos HTML Basiques
- **Minimal** → `/minimal` - Ultra-simple (30 lignes)
- **Simple** → `/simple` - Interactive avec sélecteur
- **Local** → `/local` - Version robuste
- **Original** → `/original` - Zoo d'agents

### Exemples Code
- **TypeScript Plugin** → `/example/typescript`
- **Vue 3 Composable** → `/example/vue3`
- **Vanilla Advanced** → `/example/vanilla`

---

## 🎯 Quick Start

**La méthode la plus rapide :**

```bash
# Démarrer le serveur
python3 server.py
```

**Puis aller sur :** http://localhost:3000

**Ou simplement :**

```bash
# Ouvrir une démo directement
open minimal-demo.html
```

---

## 🐛 Résolution de Problèmes

### Port 3000 déjà utilisé ?

Modifiez le port dans `server.py` :
```python
PORT = 8000  # Au lieu de 3000
```

### Python3 pas trouvé ?

Essayez :
```bash
python server.py    # Python 2/3
py server.py        # Windows
```

### Les agents ne se chargent pas ?

Vérifiez que le dossier `assets/agents/` existe :
```bash
ls -la assets/agents/
```

---

## 📚 Plus de Documentation

- **[LAUNCH_DEMOS.md](LAUNCH_DEMOS.md)** - Guide complet de lancement
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start général
- **[BUN_GUIDE.md](BUN_GUIDE.md)** - Guide Bun (si vous l'utilisez)
- **[TYPESCRIPT_README.md](TYPESCRIPT_README.md)** - API TypeScript
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Vue d'ensemble complète

---

## ✨ C'est Tout !

**Deux commandes seulement :**

```bash
python3 server.py
# Ouvrir http://localhost:3000
```

**Ou encore plus simple :**

```bash
open minimal-demo.html
```

🎉 **Amusez-vous bien avec Clippy !**
