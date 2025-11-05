/**
 * ClippyJS - Vue 3 Integration
 * Export Vue-specific functionality
 */

export { useClippy, ClippyPlugin } from './useClippy';
export type { UseClippyReturn } from './useClippy';

// Re-export types
export type {
  AgentName,
  AgentConfig,
  IAgent,
  Position,
  SpeakOptions,
} from '../types/clippy.types';

// Re-export core for convenience
export { clippy } from '../core/Loader';

export default useClippy;
