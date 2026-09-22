/**
 * Install generated sprite PNGs into public/assets/sprites/.
 * Usage: node scripts/install-sprites.mjs
 */
import { copyFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir =
  process.env.SPRITE_SRC ??
  'C:\\Users\\maugonzalez\\.cursor\\projects\\C-Users-maugonzalez-Desktop-NextGame\\assets'
const outDir = join(root, 'public', 'assets', 'sprites')

const map = {
  'dodge-player-sprite.png': 'dodge-player.png',
  'dodge-block-sprite.png': 'dodge-block.png',
  'catch-paddle-sprite.png': 'catch-paddle.png',
  'catch-fruit-sprite.png': 'catch-fruit.png',
  'tapdot-target-sprite.png': 'tapdot-target.png',
  'race-target-sprite.png': 'race-target.png',
  'jump-player-sprite.png': 'jump-player.png',
  'jump-ground-sprite.png': 'jump-ground.png',
  'balance-needle-sprite.png': 'balance-needle.png',
  'balance-zone-sprite.png': 'balance-zone.png',
  'stars-star-sprite.png': 'stars-star.png',
}

mkdirSync(outDir, { recursive: true })

let installed = 0
for (const [srcName, outName] of Object.entries(map)) {
  try {
    copyFileSync(join(srcDir, srcName), join(outDir, outName))
    console.log('Installed', outName)
    installed++
  } catch {
    console.log('Skip (missing)', srcName)
  }
}
console.log(`Done: ${installed}/${Object.keys(map).length}`)
