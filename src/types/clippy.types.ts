/**
 * ClippyJS TypeScript Type Definitions
 * Modern, type-safe interface for ClippyJS
 */

/**
 * Available Clippy agents
 */
export type AgentName =
  | 'Clippy'
  | 'Merlin'
  | 'Bonzi'
  | 'F1'
  | 'Genie'
  | 'Genius'
  | 'Links'
  | 'Peedy'
  | 'Rocky'
  | 'Rover';

/**
 * Agent animation data structure
 */
export interface AnimationFrame {
  duration: number;
  images: number[][];
  sound?: string;
  exitBranch?: number;
  branching?: {
    branches: Array<{
      frameIndex: number;
      weight: number;
    }>;
  };
}

/**
 * Agent data loaded from agent.js files
 */
export interface AgentData {
  name: string;
  framesize: [number, number];
  animations: Record<string, AnimationFrame>;
}

/**
 * Sound data structure
 */
export interface SoundData {
  [key: string]: string; // animation name -> sound URL
}

/**
 * Agent configuration options
 */
export interface AgentConfig {
  /**
   * Base path for agent assets
   * @default './assets/agents/'
   */
  basePath?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Custom sounds configuration
   */
  sounds?: boolean;
}

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Agent speaking options
 */
export interface SpeakOptions {
  /**
   * Auto-hide the speech bubble after delay (ms)
   */
  autoHide?: number;

  /**
   * Custom CSS classes for the speech bubble
   */
  className?: string;
}

/**
 * Main Agent interface
 */
export interface IAgent {
  /**
   * Show the agent on screen
   */
  show(): Promise<void>;

  /**
   * Hide the agent from screen
   */
  hide(): Promise<void>;

  /**
   * Make the agent speak with a speech bubble
   * @param text - Text to display
   * @param options - Speaking options
   */
  speak(text: string, options?: SpeakOptions): Promise<void>;

  /**
   * Play a random animation
   */
  animate(): Promise<void>;

  /**
   * Play a specific animation
   * @param animationName - Name of the animation to play
   */
  play(animationName: string): Promise<void>;

  /**
   * Move the agent to a specific position
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param duration - Animation duration in ms
   */
  moveTo(x: number, y: number, duration?: number): Promise<void>;

  /**
   * Gesture at a specific point
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  gestureAt(x: number, y: number): Promise<void>;

  /**
   * Get list of available animations
   */
  animations(): string[];

  /**
   * Stop the current action
   */
  stopCurrent(): void;

  /**
   * Stop all actions and return to idle
   */
  stop(): void;

  /**
   * Get current agent position
   */
  getPosition(): Position;

  /**
   * Check if agent is visible
   */
  isVisible(): boolean;
}

/**
 * Clippy loader interface
 */
export interface IClippyLoader {
  /**
   * Load an agent
   * @param name - Agent name
   * @param config - Configuration options
   */
  load(name: AgentName, config?: AgentConfig): Promise<IAgent>;

  /**
   * Preload agent assets without creating instance
   * @param name - Agent name
   * @param config - Configuration options
   */
  preload(name: AgentName, config?: AgentConfig): Promise<void>;
}

/**
 * Error types
 */
export class ClippyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClippyError';
  }
}

export class AgentLoadError extends ClippyError {
  constructor(agentName: string, originalError?: Error) {
    super(`Failed to load agent: ${agentName}. ${originalError?.message || ''}`);
    this.name = 'AgentLoadError';
  }
}

export class AnimationError extends ClippyError {
  constructor(animationName: string) {
    super(`Animation not found: ${animationName}`);
    this.name = 'AnimationError';
  }
}

/**
 * Event types for agent actions
 */
export type AgentEvent =
  | 'show'
  | 'hide'
  | 'move'
  | 'speak'
  | 'animate'
  | 'idle';

/**
 * Event callback type
 */
export type AgentEventCallback = (event: AgentEvent, data?: any) => void;
