/**
 * Vue 3 Composable for ClippyJS
 * Usage: const { agent, load, show, hide, speak } = useClippy()
 */

import { ref, onUnmounted, Ref } from 'vue';
import type { AgentName, AgentConfig, IAgent } from '../types/clippy.types';
import { clippy } from '../core/Loader';

export interface UseClippyReturn {
  /**
   * Current agent instance (reactive)
   */
  agent: Ref<IAgent | null>;

  /**
   * Loading state
   */
  isLoading: Ref<boolean>;

  /**
   * Error state
   */
  error: Ref<Error | null>;

  /**
   * Load an agent
   */
  load: (name: AgentName, config?: AgentConfig) => Promise<void>;

  /**
   * Show the agent
   */
  show: () => Promise<void>;

  /**
   * Hide the agent
   */
  hide: () => Promise<void>;

  /**
   * Make agent speak
   */
  speak: (text: string, autoHide?: number) => Promise<void>;

  /**
   * Play random animation
   */
  animate: () => Promise<void>;

  /**
   * Play specific animation
   */
  play: (animationName: string) => Promise<void>;

  /**
   * Move agent to position
   */
  moveTo: (x: number, y: number, duration?: number) => Promise<void>;

  /**
   * Get available animations
   */
  getAnimations: () => string[];

  /**
   * Cleanup/destroy agent
   */
  destroy: () => void;
}

/**
 * Vue 3 Composable for Clippy
 */
export function useClippy(): UseClippyReturn {
  const agent = ref<IAgent | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Load an agent
   */
  const load = async (
    name: AgentName,
    config?: AgentConfig
  ): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      agent.value = await clippy.load(name, config);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Show the agent
   */
  const show = async (): Promise<void> => {
    if (!agent.value) {
      throw new Error('Agent not loaded. Call load() first.');
    }
    await agent.value.show();
  };

  /**
   * Hide the agent
   */
  const hide = async (): Promise<void> => {
    if (!agent.value) {
      throw new Error('Agent not loaded. Call load() first.');
    }
    await agent.value.hide();
  };

  /**
   * Make agent speak
   */
  const speak = async (text: string, autoHide?: number): Promise<void> => {
    if (!agent.value) {
      throw new Error('Agent not loaded. Call load() first.');
    }
    await agent.value.speak(text, { autoHide });
  };

  /**
   * Play random animation
   */
  const animate = async (): Promise<void> => {
    if (!agent.value) {
      throw new Error('Agent not loaded. Call load() first.');
    }
    await agent.value.animate();
  };

  /**
   * Play specific animation
   */
  const play = async (animationName: string): Promise<void> => {
    if (!agent.value) {
      throw new Error('Agent not loaded. Call load() first.');
    }
    await agent.value.play(animationName);
  };

  /**
   * Move agent to position
   */
  const moveTo = async (
    x: number,
    y: number,
    duration?: number
  ): Promise<void> => {
    if (!agent.value) {
      throw new Error('Agent not loaded. Call load() first.');
    }
    await agent.value.moveTo(x, y, duration);
  };

  /**
   * Get available animations
   */
  const getAnimations = (): string[] => {
    if (!agent.value) {
      return [];
    }
    return agent.value.animations();
  };

  /**
   * Destroy agent
   */
  const destroy = (): void => {
    if (agent.value) {
      agent.value.destroy();
      agent.value = null;
    }
  };

  // Cleanup on unmount
  onUnmounted(() => {
    destroy();
  });

  return {
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
    destroy,
  };
}

/**
 * Vue 3 Plugin for Clippy
 * Install globally: app.use(ClippyPlugin)
 */
export const ClippyPlugin = {
  install(app: any, options: AgentConfig = {}) {
    // Make clippy loader available globally
    app.config.globalProperties.$clippy = clippy;

    // Provide clippy for inject()
    app.provide('clippy', clippy);

    // Set global config if provided
    if (options.basePath) {
      (window as any).CLIPPY_CDN = options.basePath;
    }
  },
};

export default useClippy;
