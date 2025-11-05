<template>
  <div class="clippy-demo">
    <div class="container">
      <h1>🎯 ClippyJS Vue 3 - Composable Demo</h1>

      <div v-if="isLoading" class="loading">
        Chargement de {{ selectedAgent }}...
      </div>

      <div v-if="error" class="error">
        Erreur : {{ error.message }}
      </div>

      <div class="controls">
        <div class="control-group">
          <label for="agent-select">Agent :</label>
          <select id="agent-select" v-model="selectedAgent" class="agent-select">
            <option v-for="agentName in agents" :key="agentName" :value="agentName">
              {{ agentName }}
            </option>
          </select>
          <button @click="loadSelectedAgent" :disabled="isLoading">
            Charger Agent
          </button>
        </div>

        <div class="button-grid">
          <button @click="show" :disabled="!agent">Afficher</button>
          <button @click="hide" :disabled="!agent">Cacher</button>
          <button @click="handleSpeak" :disabled="!agent">Parler</button>
          <button @click="animate" class="secondary" :disabled="!agent">
            Animer
          </button>
          <button @click="handleMove" class="secondary" :disabled="!agent">
            Déplacer
          </button>
          <button @click="randomAnimation" class="secondary" :disabled="!agent">
            Anim. Aléatoire
          </button>
        </div>

        <div class="control-group">
          <label for="message">Message personnalisé :</label>
          <input
            id="message"
            v-model="customMessage"
            type="text"
            placeholder="Entrez un message..."
            class="message-input"
          />
          <button @click="speakCustom" :disabled="!agent">
            Dire ce message
          </button>
        </div>
      </div>

      <div v-if="agent" class="info">
        <h3>Animations disponibles ({{ animations.length }}) :</h3>
        <div class="animations-grid">
          <button
            v-for="anim in animations"
            :key="anim"
            @click="play(anim)"
            class="anim-button"
          >
            {{ anim }}
          </button>
        </div>
      </div>

      <div class="status">
        {{ status }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useClippy } from '../../src/vue';
import type { AgentName } from '../../src/types/clippy.types';

// Available agents
const agents: AgentName[] = [
  'Clippy',
  'Merlin',
  'Bonzi',
  'F1',
  'Genie',
  'Genius',
  'Links',
  'Peedy',
  'Rocky',
  'Rover',
];

// Composable
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

// Local state
const selectedAgent = ref<AgentName>('Clippy');
const customMessage = ref('Bonjour depuis Vue 3 !');
const status = ref('Prêt');

// Computed
const animations = computed(() => getAnimations());

// Random messages
const messages = [
  'Bonjour ! Comment puis-je vous aider ?',
  'C\'est une belle journée pour coder en Vue !',
  'N\'oubliez pas de sauvegarder votre travail !',
  'Les composables Vue sont géniaux !',
  'TypeScript + Vue = ❤️',
];

// Methods
const loadSelectedAgent = async () => {
  try {
    status.value = `Chargement de ${selectedAgent.value}...`;
    await load(selectedAgent.value, {
      basePath: '../../assets/agents/',
    });
    status.value = `${selectedAgent.value} chargé avec succès !`;
  } catch (err) {
    status.value = `Erreur lors du chargement : ${(err as Error).message}`;
  }
};

const handleSpeak = async () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];
  await speak(msg, 5000);
  status.value = `Agent parle : "${msg}"`;
};

const speakCustom = async () => {
  if (customMessage.value) {
    await speak(customMessage.value, 5000);
    status.value = `Agent dit : "${customMessage.value}"`;
  }
};

const handleMove = async () => {
  const x = Math.random() * (window.innerWidth - 200);
  const y = Math.random() * (window.innerHeight - 200);
  await moveTo(x, y);
  status.value = `Déplacé vers (${Math.floor(x)}, ${Math.floor(y)})`;
};

const randomAnimation = async () => {
  await animate();
  status.value = 'Animation aléatoire jouée';
};

// Auto-load on mount
onMounted(() => {
  loadSelectedAgent();
});
</script>

<style scoped>
.clippy-demo {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
}

.loading,
.error {
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: center;
}

.loading {
  background: #e3f2fd;
  color: #1976d2;
}

.error {
  background: #ffebee;
  color: #c62828;
}

.controls {
  margin: 20px 0;
}

.control-group {
  margin: 15px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.agent-select,
.message-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
  transition: border-color 0.3s ease;
}

.agent-select:focus,
.message-input:focus {
  outline: none;
  border-color: #667eea;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin: 15px 0;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

button.secondary {
  background: #2196f3;
}

button.secondary:hover:not(:disabled) {
  background: #0b7dda;
}

.info {
  margin: 20px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.animations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.anim-button {
  padding: 8px 12px;
  font-size: 12px;
  background: #9c27b0;
}

.anim-button:hover {
  background: #7b1fa2;
}

.status {
  margin-top: 20px;
  padding: 15px;
  background: #263238;
  color: #4caf50;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}
</style>
