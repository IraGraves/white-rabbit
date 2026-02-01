import { resolve, join, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname_sim = dirname(__filename);
const input_relative = 'output\\tiles_out4';
const input_slash = 'output/tiles_out4';

console.log('--- Path Resolution Test ---');
console.log('__dirname:', __dirname_sim);
console.log('Target (Relative Windows):', input_relative);

const resolved_win = resolve(__dirname_sim, '../', input_relative);
console.log('Resolved (Windows input):', resolved_win);

const resolved_slash = resolve(__dirname_sim, '../', input_slash);
console.log('Resolved (Slash input):', resolved_slash);

console.log('Is Absolute?', isAbsolute(resolved_win));
