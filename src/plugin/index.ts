/**
 * ClippyJS - Generic TypeScript Plugin
 * Use in any TypeScript/JavaScript project
 */

export {
  ClippyPlugin,
  createClippy,
  loadClippy,
} from './ClippyPlugin';

export type { ClippyPluginConfig } from './ClippyPlugin';

// Re-export types
export type {
  AgentName,
  AgentConfig,
  IAgent,
  Position,
  SpeakOptions,
  AgentEvent,
} from '../types/clippy.types';

// Re-export core
export { clippy } from '../core/Loader';

export default ClippyPlugin;
