import { Theme } from './types.js';
export { defaultTheme } from './default.js';
export { useTheme } from '@quick/cssinjs';

declare const defineTheme: <T extends Theme>(theme: T) => T;

export { Theme, defineTheme };
