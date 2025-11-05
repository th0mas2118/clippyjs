/**
 * Generic TypeScript Plugin for ClippyJS
 * Use in any TypeScript/JavaScript project
 */

import type {
  AgentName,
  AgentConfig,
  IAgent,
  Position,
} from '../types/clippy.types';
import { clippy as clippyLoader } from '../core/Loader';

/**
 * Plugin configuration options
 */
export interface ClippyPluginConfig extends AgentConfig {
  /**
   * Auto-load agent on init
   */
  autoLoad?: AgentName;

  /**
   * Auto-show after loading
   */
  autoShow?: boolean;

  /**
   * Initial position
   */
  initialPosition?: Position;

  /**
   * Welcome message
   */
  welcomeMessage?: string;
}

/**
 * Main Clippy Plugin class
 */
export class ClippyPlugin {
  private agent: IAgent | null = null;
  private config: ClippyPluginConfig;

  constructor(config: ClippyPluginConfig = {}) {
    this.config = config;

    if (config.autoLoad) {
      this.initialize();
    }
  }

  /**
   * Initialize the plugin
   */
  private async initialize(): Promise<void> {
    if (!this.config.autoLoad) return;

    try {
      await this.load(this.config.autoLoad);

      if (this.config.autoShow) {
        await this.show();
      }

      if (this.config.initialPosition && this.agent) {
        const { x, y } = this.config.initialPosition;
        await this.agent.moveTo(x, y, 0);
      }

      if (this.config.welcomeMessage && this.agent) {
        await this.agent.speak(this.config.welcomeMessage);
      }
    } catch (error) {
      console.error('[ClippyPlugin] Failed to initialize:', error);
    }
  }

  /**
   * Load an agent
   */
  public async load(name: AgentName, config?: AgentConfig): Promise<IAgent> {
    const mergedConfig = { ...this.config, ...config };
    this.agent = await clippyLoader.load(name, mergedConfig);
    return this.agent;
  }

  /**
   * Get current agent
   */
  public getAgent(): IAgent | null {
    return this.agent;
  }

  /**
   * Show the agent
   */
  public async show(): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.show();
  }

  /**
   * Hide the agent
   */
  public async hide(): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.hide();
  }

  /**
   * Make agent speak
   */
  public async speak(text: string, autoHide?: number): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.speak(text, { autoHide });
  }

  /**
   * Play random animation
   */
  public async animate(): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.animate();
  }

  /**
   * Play specific animation
   */
  public async play(animationName: string): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.play(animationName);
  }

  /**
   * Move to position
   */
  public async moveTo(x: number, y: number, duration?: number): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.moveTo(x, y, duration);
  }

  /**
   * Gesture at point
   */
  public async gestureAt(x: number, y: number): Promise<void> {
    if (!this.agent) {
      throw new Error('[ClippyPlugin] No agent loaded');
    }
    await this.agent.gestureAt(x, y);
  }

  /**
   * Get animations
   */
  public getAnimations(): string[] {
    if (!this.agent) {
      return [];
    }
    return this.agent.animations();
  }

  /**
   * Stop current action
   */
  public stop(): void {
    if (this.agent) {
      this.agent.stop();
    }
  }

  /**
   * Destroy agent
   */
  public destroy(): void {
    if (this.agent) {
      this.agent.destroy();
      this.agent = null;
    }
  }

  /**
   * Helper: Show random tips periodically
   */
  public startRandomTips(tips: string[], intervalMs = 30000): number {
    return window.setInterval(async () => {
      if (this.agent && this.agent.isVisible()) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        await this.speak(randomTip, 5000);
        await this.animate();
      }
    }, intervalMs);
  }

  /**
   * Helper: Make agent follow cursor
   */
  public startFollowCursor(sensitivity = 0.1): () => void {
    let targetX = 0;
    let targetY = 0;

    const mouseMoveHandler = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const followInterval = setInterval(async () => {
      if (!this.agent || !this.agent.isVisible()) return;

      const current = this.agent.getPosition();
      const dx = targetX - current.x;
      const dy = targetY - current.y;

      if (Math.abs(dx) > 50 || Math.abs(dy) > 50) {
        const newX = current.x + dx * sensitivity;
        const newY = current.y + dy * sensitivity;
        await this.agent.moveTo(newX, newY, 300);
      }
    }, 500);

    document.addEventListener('mousemove', mouseMoveHandler);

    // Return cleanup function
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      clearInterval(followInterval);
    };
  }
}

/**
 * Factory function for quick setup
 */
export function createClippy(config?: ClippyPluginConfig): ClippyPlugin {
  return new ClippyPlugin(config);
}

/**
 * Quick load helper
 */
export async function loadClippy(
  name: AgentName,
  config?: AgentConfig
): Promise<IAgent> {
  return await clippyLoader.load(name, config);
}

export default ClippyPlugin;
