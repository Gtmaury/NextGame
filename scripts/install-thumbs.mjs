/**
 * Install generated thumb PNGs into public/assets/thumbs/.
 * Run after GenerateImage outputs in .cursor/projects/.../assets/
 * Usage: node scripts/install-thumbs.mjs
 */
import { copyFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir =
  process.env.THUMB_SRC ??
  'C:\\Users\\maugonzalez\\.cursor\\projects\\C-Users-maugonzalez-Desktop-NextGame\\assets'
const outDir = join(root, 'public', 'assets', 'thumbs')

const map = {
  'catch-thumb.png': 'catch.png',
  'tapdot-thumb.png': 'tapdot.png',
  'race-thumb.png': 'race.png',
  'dodge-thumb.png': 'dodge.png',
  'jump-thumb.png': 'jump.png',
  'balance-thumb.png': 'balance.png',
  'stars-thumb.png': 'stars.png',
  'slice-thumb.png': 'slice.png',
  'stack-thumb.png': 'stack.png',
  'memory-thumb.png': 'memory.png',
  'flap-thumb.png': 'flap.png',
  'swipe-thumb.png': 'swipe.png',
  'hold-thumb.png': 'hold.png',
}

mkdirSync(outDir, { recursive: true })

for (const [srcName, outName] of Object.entries(map)) {
  copyFileSync(join(srcDir, srcName), join(outDir, outName))
  console.log('Installed', outName)
}
