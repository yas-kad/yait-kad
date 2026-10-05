export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatEvent =
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; code: string; message: string };
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_HISTORY = 6;
