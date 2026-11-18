// News-image entry (Node 22, standard library only): the poster is the
// entry.png beside this file. This program copies it to the output directory
// the grader provides, byte for byte, so both runs of the entry write
// identical bytes.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Refuse to copy a file that is not a PNG: the gate only accepts a whole
// PNG or JPEG, and a corrupt source should fail loudly here, not at grading.
const head = readFileSync(source, { flag: 'r' }).subarray(0, 8);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!head.equals(PNG_SIGNATURE)) {
  throw new Error(`${source} is not a PNG file`);
}

copyFileSync(source, target);
const { size } = statSync(target);
console.log(`wrote ${target} (${size} bytes)`);
