import * as react from 'react';
import { Dicts } from '../dicts/types.js';

declare const ConfigContext: react.Context<{
    dicts: Dicts;
}>;

export { ConfigContext };
