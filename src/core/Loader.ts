/**
 * Modern TypeScript Loader for Clippy agents
 */

import type {
  AgentName,
  AgentConfig,
  AgentData,
  SoundData,
  IAgent,
  IClippyLoader,
} from '../types/clippy.types';
import { AgentLoadError } from '../types/clippy.types';
import { Agent } from './Agent';

/**
 * Cache for loaded agents
 */
interface LoadedAgent {
  data: AgentData;
  sounds: SoundData;
  map: HTMLImageElement;
}

export class ClippyLoader implements IClippyLoader {
  private cache: Map<AgentName, LoadedAgent> = new Map();
  private defaultBasePath = './assets/agents/';

  /**
   * Load an agent
   */
  public async load(
    name: AgentName,
    config: AgentConfig = {}
  ): Promise<IAgent> {
    const basePath = config.basePath || this.defaultBasePath;
    const agentPath = `${basePath}${name}`;

    try {
      // Check cache first
      let loaded = this.cache.get(name);

      if (!loaded) {
        // Load agent assets
        const [data, sounds, map] = await Promise.all([
          this.loadAgentData(agentPath),
          config.sounds !== false
            ? this.loadSounds(agentPath)
            : Promise.resolve({}),
          this.loadMap(agentPath),
        ]);

        loaded = { data, sounds, map };
        this.cache.set(name, loaded);
      }

      // Create agent instance
      const agent = new Agent(loaded.data, loaded.sounds, agentPath);

      if (config.debug) {
        console.log(`[Clippy] Loaded agent: ${name}`, loaded);
      }

      return agent;
    } catch (error) {
      throw new AgentLoadError(name, error as Error);
    }
  }

  /**
   * Preload agent without creating instance
   */
  public async preload(
    name: AgentName,
    config: AgentConfig = {}
  ): Promise<void> {
    const basePath = config.basePath || this.defaultBasePath;
    const agentPath = `${basePath}${name}`;

    if (this.cache.has(name)) {
      return; // Already loaded
    }

    try {
      const [data, sounds, map] = await Promise.all([
        this.loadAgentData(agentPath),
        config.sounds !== false
          ? this.loadSounds(agentPath)
          : Promise.resolve({}),
        this.loadMap(agentPath),
      ]);

      this.cache.set(name, { data, sounds, map });

      if (config.debug) {
        console.log(`[Clippy] Preloaded agent: ${name}`);
      }
    } catch (error) {
      throw new AgentLoadError(name, error as Error);
    }
  }

  /**
   * Load agent data from agent.js
   */
  private async loadAgentData(agentPath: string): Promise<AgentData> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const callbackName = `clippyReady_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Setup global callback
      (window as any)[callbackName] = (data: AgentData) => {
        delete (window as any)[callbackName];
        script.remove();
        resolve(data);
      };

      script.onerror = () => {
        delete (window as any)[callbackName];
        script.remove();
        reject(new Error(`Failed to load agent data from ${agentPath}/agent.js`));
      };

      script.src = `${agentPath}/agent.js?callback=${callbackName}`;
      document.head.appendChild(script);

      // Fallback: agent.js might use old clippy.ready() format
      const oldStyleCallback = (data: AgentData) => {
        if ((window as any)[callbackName]) {
          (window as any)[callbackName](data);
        }
      };

      // Override global clippy.ready temporarily
      const originalReady = (window as any).clippy?.ready;
      if (!(window as any).clippy) {
        (window as any).clippy = {};
      }
      (window as any).clippy.ready = oldStyleCallback;

      // Restore after timeout
      setTimeout(() => {
        if (originalReady) {
          (window as any).clippy.ready = originalReady;
        }
      }, 5000);
    });
  }

  /**
   * Load sounds
   */
  private async loadSounds(agentPath: string): Promise<SoundData> {
    return new Promise((resolve) => {
      // Detect audio support
      const audio = document.createElement('audio');
      const canPlayMp3 =
        !!audio.canPlayType && audio.canPlayType('audio/mpeg') !== '';
      const canPlayOgg =
        !!audio.canPlayType &&
        audio.canPlayType('audio/ogg; codecs="vorbis"') !== '';

      if (!canPlayMp3 && !canPlayOgg) {
        resolve({});
        return;
      }

      const soundFile = canPlayMp3 ? 'sounds-mp3.js' : 'sounds-ogg.js';
      const script = document.createElement('script');
      const callbackName = `clippySoundsReady_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Setup global callback
      (window as any)[callbackName] = (data: SoundData) => {
        delete (window as any)[callbackName];
        script.remove();
        resolve(data);
      };

      script.onerror = () => {
        delete (window as any)[callbackName];
        script.remove();
        resolve({}); // Don't fail on sound load error
      };

      script.src = `${agentPath}/${soundFile}?callback=${callbackName}`;
      document.head.appendChild(script);

      // Fallback for old clippy.soundsReady() format
      const oldStyleCallback = (name: string, data: SoundData) => {
        if ((window as any)[callbackName]) {
          (window as any)[callbackName](data);
        }
      };

      if (!(window as any).clippy) {
        (window as any).clippy = {};
      }
      const originalSoundsReady = (window as any).clippy.soundsReady;
      (window as any).clippy.soundsReady = oldStyleCallback;

      setTimeout(() => {
        if (originalSoundsReady) {
          (window as any).clippy.soundsReady = originalSoundsReady;
        }
      }, 5000);
    });
  }

  /**
   * Load sprite map image
   */
  private async loadMap(agentPath: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error(`Failed to load map from ${agentPath}/map.png`));

      img.src = `${agentPath}/map.png`;
    });
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Check if agent is cached
   */
  public isCached(name: AgentName): boolean {
    return this.cache.has(name);
  }
}

/**
 * Singleton instance
 */
export const clippy: IClippyLoader = new ClippyLoader();

/**
 * Export default instance
 */
export default clippy;
