/**
 * Generates minimal pixel-art PNG placeholders for thumbs and sprites.
 * Run: node scripts/generate-assets.mjs
 */
import { mkdirSync, writeFileSync } from 'fs'
import { deflateSync } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const gameColors = {
  catch: [244, 114, 182],
  tapdot: [251, 191, 36],
  race: [56, 189, 248],
  dodge: [52, 211, 153],
  jump: [251, 146, 60],
  balance: [167, 139, 250],
  stars: [250, 204, 21],
}

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  return (c ^ ~0) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function png(w, h, fillRgb, accentRgb) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1) + 1
    for (let x = 0; x < w; x++) {
      const i = row + x * 4
      const border = x === 0 || y === 0 || x === w - 1 || y === h - 1
      const inner =
        x >= 4 && x < w - 4 && y >= 4 && y < h - 4 && (x + y) % 4 === 0
      const rgb = border ? [20, 20, 30] : inner ? accentRgb : fillRgb
      raw[i] = rgb[0]
      raw[i + 1] = rgb[1]
      raw[i + 2] = rgb[2]
      raw[i + 3] = 255
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const thumbsDir = join(root, 'public/assets/thumbs')
const spritesDir = join(root, 'public/assets/sprites')
mkdirSync(thumbsDir, { recursive: true })
mkdirSync(spritesDir, { recursive: true })

for (const [id, rgb] of Object.entries(gameColors)) {
  writeFileSync(join(thumbsDir, `${id}.png`), png(64, 64, rgb, [255, 255, 255]))
}

const sprites = {
  'catch-paddle': gameColors.catch,
  'catch-fruit': [255, 100, 120],
  'tapdot-target': gameColors.tapdot,
  'race-target': gameColors.race,
  'dodge-player': gameColors.dodge,
  'dodge-block': [220, 60, 80],
  'jump-player': gameColors.jump,
  'jump-ground': [120, 80, 50],
  'balance-needle': gameColors.balance,
  'balance-zone': [100, 200, 150],
  'stars-star': gameColors.stars,
}

for (const [name, rgb] of Object.entries(sprites)) {
  writeFileSync(join(spritesDir, `${name}.png`), png(32, 32, rgb, [255, 255, 255]))
}

console.log('Generated thumbs and sprites in public/assets/')
