# ClippyJS - Modern TypeScript Implementation 🎯

Version TypeScript moderne et maintenable de ClippyJS, sans dépendances jQuery.

## 📦 Structure du Projet

```
src/
├── core/           # Core logic (Agent, Loader)
├── types/          # TypeScript type definitions
├── vue/            # Vue 3 composable & plugin
├── plugin/         # Generic TypeScript plugin
└── index.ts        # Main entry point
```

## 🚀 Installation

```bash
# Depuis le projet
npm install
# ou
yarn install
```

## 📚 Usage

### 1. Plugin TypeScript Générique (Tout projet TS/JS)

Pour utiliser dans **n'importe quel projet TypeScript ou JavaScript** :

```typescript
// import depuis /src/plugin
import { createClippy } from './src/plugin';

// Créer l'instance
const clippy = createClippy({
  basePath: './assets/agents/',
  autoLoad: 'Clippy',
  autoShow: true,
  initialPosition: { x: 100, y: 100 },
  welcomeMessage: 'Bonjour ! Je suis Clippy !'
});

// Ou charger manuellement
const clippy = createClippy();
await clippy.load('Merlin');
await clippy.show();
await clippy.speak('Hello World!', 5000); // auto-hide après 5s
await clippy.animate();
```

#### Exemple complet (Vanilla TS)

```typescript
import { ClippyPlugin } from './src/plugin';

// Créer instance
const clippy = new ClippyPlugin({
  basePath: './assets/agents/',
  debug: true
});

// Charger et utiliser
async function demo() {
  // Charger Clippy
  await clippy.load('Clippy');
  await clippy.show();

  // Déplacer
  await clippy.moveTo(200, 200);

  // Parler
  await clippy.speak('Bienvenue sur mon site !');

  // Animer
  await clippy.animate();

  // Obtenir les animations disponibles
  const animations = clippy.getAnimations();
  console.log('Animations:', animations);

  // Jouer une animation spécifique
  await clippy.play('Congratulate');
}

demo();
```

#### Fonctions Helper

```typescript
// Tips aléatoires toutes les 30 secondes
const tips = [
  'Pensez à sauvegarder !',
  'Besoin d\'aide ?',
  'Bonne journée !',
];

const timerId = clippy.startRandomTips(tips, 30000);

// Arrêter les tips
clearInterval(timerId);

// Faire suivre le curseur
const stopFollowing = clippy.startFollowCursor(0.1);

// Arrêter de suivre
stopFollowing();
```

### 2. Vue 3 Composable

Pour utiliser dans un **projet Vue 3** :

#### Option A : Composable (Recommandé)

```vue
<script setup lang="ts">
import { useClippy } from './src/vue';
import { onMounted } from 'vue';

const {
  agent,
  isLoading,
  error,
  load,
  show,
  hide,
  speak,
  animate,
  play,
  moveTo,
  getAnimations,
} = useClippy();

onMounted(async () => {
  try {
    await load('Clippy', {
      basePath: './assets/agents/',
    });

    await show();
    await speak('Bonjour depuis Vue 3 !');
  } catch (err) {
    console.error('Failed to load Clippy:', err);
  }
});

// Actions
const handleSpeak = () => {
  speak('Coucou !', 3000);
};

const handleAnimate = () => {
  animate();
};

const handleMove = () => {
  moveTo(Math.random() * 500, Math.random() * 500);
};
</script>

<template>
  <div>
    <div v-if="isLoading">Chargement de Clippy...</div>
    <div v-if="error">Erreur : {{ error.message }}</div>

    <div v-if="agent">
      <button @click="handleSpeak">Parler</button>
      <button @click="handleAnimate">Animer</button>
      <button @click="handleMove">Déplacer</button>
      <button @click="show">Afficher</button>
      <button @click="hide">Cacher</button>
    </div>
  </div>
</template>
```

#### Option B : Plugin Global

```typescript
// main.ts
import { createApp } from 'vue';
import { ClippyPlugin } from './src/vue';
import App from './App.vue';

const app = createApp(App);

// Installer le plugin
app.use(ClippyPlugin, {
  basePath: './assets/agents/',
});

app.mount('#app');
```

Puis dans vos composants :

```vue
<script setup lang="ts">
import { inject } from 'vue';

const clippy = inject('clippy');

async function loadClippy() {
  const agent = await clippy.load('Merlin');
  await agent.show();
  await agent.speak('Hello from Vue!');
}
</script>
```

#### Exemple Composant Vue Complet

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useClippy } from './src/vue';
import type { AgentName } from './src/types/clippy.types';

const { agent, isLoading, load, show, speak, animate, getAnimations } = useClippy();

const selectedAgent = ref<AgentName>('Clippy');
const animations = ref<string[]>([]);
const message = ref('Bonjour !');

const agents: AgentName[] = [
  'Clippy', 'Merlin', 'Bonzi', 'F1', 'Genie',
  'Genius', 'Links', 'Peedy', 'Rocky', 'Rover'
];

const loadAgent = async () => {
  await load(selectedAgent.value, {
    basePath: './assets/agents/',
  });
  await show();
  animations.value = getAnimations();
};

const handleSpeak = () => {
  speak(message.value, 5000);
};

onMounted(() => {
  loadAgent();
});
</script>

<template>
  <div class="clippy-controls">
    <h2>Contrôles Clippy</h2>

    <div v-if="isLoading">Chargement...</div>

    <div v-else class="controls">
      <select v-model="selectedAgent">
        <option v-for="a in agents" :key="a" :value="a">
          {{ a }}
        </option>
      </select>
      <button @click="loadAgent">Charger</button>

      <input v-model="message" placeholder="Message..." />
      <button @click="handleSpeak">Parler</button>

      <button @click="animate">Animer</button>
    </div>

    <div v-if="animations.length" class="animations">
      <h3>Animations disponibles :</h3>
      <ul>
        <li v-for="anim in animations" :key="anim">{{ anim }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.clippy-controls {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.controls {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #4CAF50;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>
```

### 3. React (via Plugin)

```typescript
// useClippy.tsx (React Hook)
import { useEffect, useRef, useState } from 'react';
import { ClippyPlugin } from './src/plugin';
import type { AgentName } from './src/types/clippy.types';

export function useClippyReact(agentName: AgentName) {
  const clippyRef = useRef<ClippyPlugin | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const clippy = new ClippyPlugin({
      basePath: './assets/agents/',
    });

    clippy.load(agentName).then(() => {
      clippy.show();
      setIsLoaded(true);
    });

    clippyRef.current = clippy;

    return () => {
      clippy.destroy();
    };
  }, [agentName]);

  return { clippy: clippyRef.current, isLoaded };
}

// Usage dans un composant
function App() {
  const { clippy, isLoaded } = useClippyReact('Clippy');

  const handleSpeak = () => {
    clippy?.speak('Hello from React!');
  };

  return (
    <div>
      {isLoaded && (
        <button onClick={handleSpeak}>Make Clippy Speak</button>
      )}
    </div>
  );
}
```

## 🎨 API Complète

### Agent Methods

```typescript
interface IAgent {
  // Affichage
  show(): Promise<void>;
  hide(): Promise<void>;
  isVisible(): boolean;

  // Parole
  speak(text: string, options?: SpeakOptions): Promise<void>;

  // Animations
  animate(): Promise<void>;                    // Aléatoire
  play(animationName: string): Promise<void>;  // Spécifique
  animations(): string[];                      // Liste

  // Mouvement
  moveTo(x: number, y: number, duration?: number): Promise<void>;
  gestureAt(x: number, y: number): Promise<void>;
  getPosition(): Position;

  // Contrôle
  stopCurrent(): void;  // Arrêter l'action en cours
  stop(): void;         // Tout arrêter
  destroy(): void;      // Nettoyer et détruire

  // Events
  on(event: AgentEvent, callback: AgentEventCallback): void;
  off(event: AgentEvent, callback: AgentEventCallback): void;
}
```

### Types Disponibles

```typescript
type AgentName =
  | 'Clippy' | 'Merlin' | 'Bonzi' | 'F1' | 'Genie'
  | 'Genius' | 'Links' | 'Peedy' | 'Rocky' | 'Rover';

type AgentEvent = 'show' | 'hide' | 'move' | 'speak' | 'animate' | 'idle';

interface Position {
  x: number;
  y: number;
}

interface SpeakOptions {
  autoHide?: number;    // ms avant de cacher
  className?: string;   // CSS custom
}

interface AgentConfig {
  basePath?: string;    // Chemin des assets
  debug?: boolean;      // Mode debug
  sounds?: boolean;     // Activer les sons
}
```

## 📦 Build & Export

### Configuration TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Build avec Vite (Recommandé)

```bash
npm install -D vite typescript
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        plugin: resolve(__dirname, 'src/plugin/index.ts'),
        vue: resolve(__dirname, 'src/vue/index.ts'),
      },
      name: 'ClippyJS',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
});
```

## 🎯 Avantages de cette Version

✅ **TypeScript natif** - Types complets et auto-complétion
✅ **Sans jQuery** - Plus léger et moderne
✅ **Modular** - Import seulement ce dont vous avez besoin
✅ **Promise-based** - API moderne avec async/await
✅ **Vue 3 ready** - Composable et plugin officiels
✅ **Tree-shakeable** - Optimisation automatique du bundle
✅ **Type-safe** - Erreurs détectées à la compilation
✅ **Event system** - Système d'événements pour réagir aux actions
✅ **Maintenable** - Code propre et bien organisé

## 🐛 Troubleshooting

### Les agents ne se chargent pas

Vérifiez que le `basePath` pointe vers le bon dossier :

```typescript
await clippy.load('Clippy', {
  basePath: './assets/agents/', // Ajustez selon votre structure
});
```

### TypeScript errors

Assurez-vous d'avoir les types importés :

```typescript
import type { AgentName, IAgent } from './src/types/clippy.types';
```

## 📄 Licence

MIT

## 🙏 Remerciements

- ClippyJS original par [pi0](https://github.com/pi0/clippyjs)
- Clippy.JS par [Smore](http://smore.com/clippy-js)
- Microsoft pour avoir créé Clippy
