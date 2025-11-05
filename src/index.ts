/**
 * ClippyJS - Modern TypeScript Implementation
 * Main entry point
 */

// Core exports
export { Agent } from './core/Agent';
export { ClippyLoader, clippy } from './core/Loader';

// Types
export type {
  AgentName,
  AgentData,
  SoundData,
  AgentConfig,
  Position,
  SpeakOptions,
  IAgent,
  IClippyLoader,
  AgentEvent,
  AgentEventCallback,
  AnimationFrame,
} from './types/clippy.types';

export {
  ClippyError,
  AgentLoadError,
  AnimationError,
} from './types/clippy.types';

// Default export
export { clippy as default } from './core/Loader';
