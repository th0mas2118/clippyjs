/**
 * Modern TypeScript Agent implementation
 * No jQuery dependency - pure TypeScript
 */

import type {
  AgentData,
  SoundData,
  Position,
  SpeakOptions,
  IAgent,
  AgentEvent,
  AgentEventCallback,
  AnimationError,
} from '../types/clippy.types';

export class Agent implements IAgent {
  private data: AgentData;
  private sounds: SoundData;
  private basePath: string;
  private element: HTMLElement | null = null;
  private balloon: HTMLElement | null = null;
  private isShown = false;
  private position: Position = { x: 0, y: 0 };
  private currentAnimation: string | null = null;
  private animationFrame = 0;
  private animationTimer: number | null = null;
  private actionQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private eventListeners: Map<AgentEvent, Set<AgentEventCallback>> = new Map();

  constructor(data: AgentData, sounds: SoundData, basePath: string) {
    this.data = data;
    this.sounds = sounds;
    this.basePath = basePath;
    this.createElement();
  }

  /**
   * Create the agent DOM element
   */
  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = 'clippy-agent';
    this.element.style.cssText = `
      position: fixed;
      z-index: 10000;
      pointer-events: auto;
      cursor: pointer;
      display: none;
      width: ${this.data.framesize[0]}px;
      height: ${this.data.framesize[1]}px;
    `;

    // Add click event
    this.element.addEventListener('click', () => {
      this.emit('animate');
      this.animate();
    });

    document.body.appendChild(this.element);
  }

  /**
   * Event emitter
   */
  private emit(event: AgentEvent, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(event, data));
    }
  }

  /**
   * Add event listener
   */
  public on(event: AgentEvent, callback: AgentEventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  public off(event: AgentEvent, callback: AgentEventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Show the agent
   */
  public async show(): Promise<void> {
    return this.queueAction(async () => {
      if (this.isShown) return;

      if (this.element) {
        this.element.style.display = 'block';
        this.isShown = true;
        this.emit('show');
        await this.play('Show');
      }
    });
  }

  /**
   * Hide the agent
   */
  public async hide(): Promise<void> {
    return this.queueAction(async () => {
      if (!this.isShown) return;

      await this.play('Hide');

      if (this.element) {
        this.element.style.display = 'none';
        this.isShown = false;
        this.emit('hide');
      }
    });
  }

  /**
   * Make the agent speak
   */
  public async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    return this.queueAction(async () => {
      this.hideBalloon();

      this.balloon = document.createElement('div');
      this.balloon.className = `clippy-balloon ${options.className || ''}`;
      this.balloon.style.cssText = `
        position: fixed;
        background: #FFFFE0;
        border: 2px solid #000;
        border-radius: 8px;
        padding: 12px;
        max-width: 200px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
      `;

      this.balloon.textContent = text;
      document.body.appendChild(this.balloon);

      // Position balloon near agent
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        this.balloon.style.left = `${rect.left + rect.width + 10}px`;
        this.balloon.style.top = `${rect.top}px`;
      }

      this.emit('speak', { text });

      // Auto-hide after delay
      if (options.autoHide) {
        await new Promise((resolve) => setTimeout(resolve, options.autoHide));
        this.hideBalloon();
      }
    });
  }

  /**
   * Hide speech balloon
   */
  private hideBalloon(): void {
    if (this.balloon) {
      this.balloon.remove();
      this.balloon = null;
    }
  }

  /**
   * Play a random animation
   */
  public async animate(): Promise<void> {
    const animations = this.animations();
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    return this.play(randomAnimation);
  }

  /**
   * Play a specific animation
   */
  public async play(animationName: string): Promise<void> {
    return this.queueAction(async () => {
      const animation = this.data.animations[animationName];

      if (!animation) {
        const error = new AnimationError(animationName) as any;
        throw error;
      }

      this.currentAnimation = animationName;
      this.emit('animate', { animation: animationName });

      // Play animation frames
      await this.playAnimationFrames(animation);

      this.currentAnimation = null;
    });
  }

  /**
   * Play animation frames
   */
  private async playAnimationFrames(animation: any): Promise<void> {
    const frames = animation.images || [];

    for (let i = 0; i < frames.length; i++) {
      if (!this.element) return;

      const frame = frames[i];
      const [x, y] = frame;

      // Set background position
      this.element.style.backgroundImage = `url(${this.basePath}/map.png)`;
      this.element.style.backgroundPosition = `-${x}px -${y}px`;

      // Wait for frame duration
      await new Promise((resolve) => {
        this.animationTimer = window.setTimeout(resolve, animation.duration || 100);
      });
    }
  }

  /**
   * Move agent to position
   */
  public async moveTo(x: number, y: number, duration = 500): Promise<void> {
    return this.queueAction(async () => {
      const startPos = { ...this.position };
      const startTime = Date.now();

      // Play move animation if available
      const moveAnimation = this.getMoveAnimation(startPos, { x, y });
      if (moveAnimation) {
        await this.play(moveAnimation);
      }

      // Animate movement
      return new Promise<void>((resolve) => {
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-in-out)
          const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentX = startPos.x + (x - startPos.x) * eased;
          const currentY = startPos.y + (y - startPos.y) * eased;

          this.setPosition(currentX, currentY);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.emit('move', { x, y });
            resolve();
          }
        };

        animate();
      });
    });
  }

  /**
   * Gesture at a point
   */
  public async gestureAt(x: number, y: number): Promise<void> {
    // Move towards point and play gesture animation
    const midX = (this.position.x + x) / 2;
    const midY = (this.position.y + y) / 2;

    await this.moveTo(midX, midY);

    const gestureAnims = this.animations().filter((a) =>
      a.toLowerCase().includes('gesture')
    );

    if (gestureAnims.length > 0) {
      await this.play(gestureAnims[0]);
    }
  }

  /**
   * Get move animation based on direction
   */
  private getMoveAnimation(from: Position, to: Position): string | null {
    const animations = this.animations();
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0
        ? animations.find((a) => a.includes('MoveRight')) || null
        : animations.find((a) => a.includes('MoveLeft')) || null;
    } else {
      return dy > 0
        ? animations.find((a) => a.includes('MoveDown')) || null
        : animations.find((a) => a.includes('MoveUp')) || null;
    }
  }

  /**
   * Set agent position
   */
  private setPosition(x: number, y: number): void {
    this.position = { x, y };
    if (this.element) {
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  }

  /**
   * Get available animations
   */
  public animations(): string[] {
    return Object.keys(this.data.animations);
  }

  /**
   * Stop current action
   */
  public stopCurrent(): void {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }

  /**
   * Stop all actions
   */
  public stop(): void {
    this.stopCurrent();
    this.actionQueue = [];
    this.isProcessingQueue = false;
    this.hideBalloon();
    this.emit('idle');
  }

  /**
   * Get current position
   */
  public getPosition(): Position {
    return { ...this.position };
  }

  /**
   * Check if visible
   */
  public isVisible(): boolean {
    return this.isShown;
  }

  /**
   * Queue an action
   */
  private async queueAction(action: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.actionQueue.push(async () => {
        try {
          await action();
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Process action queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;

    this.isProcessingQueue = true;

    while (this.actionQueue.length > 0) {
      const action = this.actionQueue.shift();
      if (action) {
        await action();
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Destroy agent and cleanup
   */
  public destroy(): void {
    this.stop();
    this.hideBalloon();

    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    this.eventListeners.clear();
  }
}
