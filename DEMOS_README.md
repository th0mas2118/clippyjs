# 🎉 Démos ClippyJS

Ce projet contient plusieurs démos fonctionnelles de ClippyJS.

## 📁 Fichiers de démonstration

### 1. `minimal-demo.html` - Démo Ultra-Simple
La démo la plus basique possible. Parfait pour comprendre les bases.

**Caractéristiques :**
- Code minimal (environ 30 lignes)
- Charge Clippy automatiquement
- Affiche un message de bienvenue
- Parfait pour les débutants

**Pour l'utiliser :**
```bash
# Ouvrir directement dans un navigateur
firefox minimal-demo.html
# ou
chromium minimal-demo.html
# ou double-cliquez sur le fichier
```

### 2. `simple-demo.html` - Démo Interactive Complète
Une démo plus avancée avec contrôles interactifs.

**Caractéristiques :**
- Sélection de 10 agents différents (Clippy, Merlin, Bonzi, etc.)
- Boutons de contrôle (Afficher, Cacher, Parler, Animer, Déplacer)
- Interface utilisateur stylisée
- Messages aléatoires
- Interaction au clic sur l'agent

**Pour l'utiliser :**
```bash
# Ouvrir directement dans un navigateur
firefox simple-demo.html
# ou
chromium simple-demo.html
# ou double-cliquez sur le fichier
```

### 3. `demo/index.html` - Démo Originale (Zoo d'agents)
La démo originale du projet qui charge tous les agents successivement.

## 🚀 Démarrage Rapide

### Option 1 : Ouvrir directement dans un navigateur
Cliquez simplement sur n'importe quel fichier HTML pour l'ouvrir dans votre navigateur.

### Option 2 : Serveur HTTP local (recommandé pour le développement)
```bash
# Avec Python 3
python3 -m http.server 8000

# Avec Python 2
python -m SimpleHTTPServer 8000

# Avec Node.js (si http-server est installé)
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

Puis ouvrez http://localhost:8000/minimal-demo.html ou http://localhost:8000/simple-demo.html

## 📝 Agents Disponibles

ClippyJS supporte 10 agents différents :

1. **Clippy** - Le célèbre trombone de Microsoft Office
2. **Merlin** - Le magicien
3. **Bonzi** - Le singe violet (Bonzi Buddy)
4. **F1** - Le robot
5. **Genie** - Le génie
6. **Genius** - Einstein
7. **Links** - Le chat
8. **Peedy** - Le perroquet
9. **Rocky** - Le chien
10. **Rover** - Le chien rouge

## 💻 Utilisation dans votre propre projet

### Méthode simple (CDN)
Copiez ce code dans votre HTML :

```html
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="https://gitcdn.xyz/repo/pi0/clippyjs/master/assets/clippy.css">

<!-- Scripts -->
<script src="https://unpkg.com/jquery@3.2.1"></script>
<script src="https://unpkg.com/clippyjs@latest"></script>

<script>
    clippy.load('Clippy', function(agent) {
        agent.show();
        agent.speak('Bonjour !');
    });
</script>
```

## 🎮 API Principale

```javascript
// Charger un agent
clippy.load('Clippy', function(agent) {
    // L'agent est chargé et prêt
});

// Afficher l'agent
agent.show();

// Cacher l'agent
agent.hide();

// Faire parler l'agent
agent.speak('Bonjour !');

// Jouer une animation aléatoire
agent.animate();

// Jouer une animation spécifique
agent.play('Congratulate');

// Déplacer l'agent
agent.moveTo(100, 100);

// Obtenir la liste des animations
agent.animations();

// Arrêter l'action en cours
agent.stopCurrent();

// Arrêter toutes les actions
agent.stop();
```

## 🐛 Problèmes connus

- Le premier chargement peut prendre quelques secondes (les assets sont téléchargés depuis le CDN)
- Nécessite jQuery
- Les agents sont des fichiers assez lourds (plusieurs MB au total)

## 📚 Ressources

- [Repository original](https://github.com/pi0/clippyjs)
- [Clippy.JS original](http://smore.com/clippy-js)

## 📄 Licence

MIT
