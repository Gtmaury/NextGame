/**
 * Generates crisp pixel-art sprites for all minigames.
 * Run: node scripts/generate-pixel-sprites.mjs
 */
import { mkdirSync, writeFileSync } from 'fs'
import { deflateSync } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const spritesDir = join(root, 'public/assets/sprites')
mkdirSync(spritesDir, { recursive: true })

/** @type {Record<string, [number, number, number, number]>} */
const PAL = {
  '.': [0, 0, 0, 0],
  '#': [18, 18, 28, 255],
  G: [52, 211, 153, 255],
  g: [34, 160, 120, 255],
  L: [167, 243, 208, 255],
  R: [239, 68, 68, 255],
  r: [185, 28, 28, 255],
  W: [255, 255, 255, 255],
  B: [18, 18, 28, 255],
  E: [251, 113, 133, 255],
  P: [244, 114, 182, 255],
  p: [219, 39, 119, 255],
  H: [74, 222, 128, 255],
  h: [22, 101, 52, 255],
  Y: [251, 191, 36, 255],
  y: [202, 138, 4, 255],
  O: [251, 146, 60, 255],
  o: [194, 65, 12, 255],
  C: [56, 189, 248, 255],
  c: [2, 132, 199, 255],
  V: [167, 139, 250, 255],
  v: [109, 40, 217, 255],
  S: [250, 204, 21, 255],
  s: [202, 138, 4, 255],
  D: [120, 80, 50, 255],
  d: [87, 55, 30, 255],
  T: [180, 140, 90, 255],
  A: [100, 200, 150, 255],
  a: [52, 140, 100, 255],
  M: [255, 0, 255, 255],
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

function encodePng(w, h, pixels) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1) + 1
    for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4
      const dst = row + x * 4
      raw[dst] = pixels[src]
      raw[dst + 1] = pixels[src + 1]
      raw[dst + 2] = pixels[src + 2]
      raw[dst + 3] = pixels[src + 3]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** @param {string[]} rows @param {number} scale */
function artToPixels(rows, scale = 3) {
  const h = rows.length
  const w = rows[0].length
  const outW = w * scale
  const outH = h * scale
  const pixels = Buffer.alloc(outW * outH * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x]
      const col = PAL[ch] ?? PAL['.']
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const px = (y * scale + sy) * outW + (x * scale + sx)
          const i = px * 4
          pixels[i] = col[0]
          pixels[i + 1] = col[1]
          pixels[i + 2] = col[2]
          pixels[i + 3] = col[3]
        }
      }
    }
  }
  return { w: outW, h: outH, pixels }
}

function saveArt(name, rows, scale = 3) {
  const { w, h, pixels } = artToPixels(rows, scale)
  writeFileSync(join(spritesDir, `${name}.png`), encodePng(w, h, pixels))
  console.log('  ', name, `${w}x${h}`)
}

const thumbsDir = join(root, 'public/assets/thumbs')
mkdirSync(thumbsDir, { recursive: true })

function assertRows(name, rows) {
  const w = rows[0].length
  for (const r of rows) {
    if (r.length !== w) {
      throw new Error(`${name}: row length ${r.length} != ${w} (${r})`)
    }
  }
}

function saveThumb(name, rows, scale = 8) {
  assertRows(name, rows)
  const { w, h, pixels } = artToPixels(rows, scale)
  writeFileSync(join(thumbsDir, `${name}.png`), encodePng(w, h, pixels))
  console.log('  thumb', name, `${w}x${h}`)
}

const sprites = {
  'dodge-player': [
    '......#......',
    '.....#G#.....',
    '....#GGG#....',
    '...#GGGGG#...',
    '..#GGGGGGG#..',
    '..#GWEWEGG#..',
    '..#GWBBBWG#..',
    '..#GWBBBWG#..',
    '..#GGGEGGG#..',
    '...#GGGGG#...',
    '....#GLG#....',
    '....#G.G#....',
    '.....#.#.....',
    '......#......',
  ],
  'dodge-block': [
    '....#R#....',
    '...#RRR#...',
    '..#RRRRR#..',
    '.#RRRRRRR#.',
    '.#RWEWER#.',
    '.#RWB BWR#.',
    '.#RWB BWR#.',
    '.#RWEWER#.',
    '.#RRRRRRR#.',
    '..#RRRRR#..',
    '...#RRR#...',
    '....#R#....',
    '....#.#....',
    '....#.#....',
  ],
  'catch-paddle': [
    '..............',
    '....########..',
    '..##PPPPPPPP##',
    '.#PPPPPPPPPPP#',
    '#PPPPWWWWWWPPP#',
    '#PPPPWWWWWWPPP#',
    '.#PPPPPPPPPPP#',
    '..##PPPPPPPP##',
    '....########..',
    '..............',
  ],
  'catch-fruit': [
    '.....#H#.....',
    '....#HHH#....',
    '...#HHHHH#...',
    '..#HRRRRRH#..',
    '.#HRRYRRRRH#.',
    '.#HRRYRRRRH#.',
    '.#HRRRRRRRH#.',
    '.#HRRYRRRRH#.',
    '..#HRRRRRH#..',
    '...#HHHHH#...',
    '....#RRR#....',
    '.....#R#.....',
  ],
  'tapdot-target': [
    '.....#.....',
    '...#YYY#...',
    '..#YWWY#..',
    '.#YWYYWY#.',
    '#YWY##YWY#',
    '#YWY##YWY#',
    '.#YWYYWY#.',
    '..#YWWY#..',
    '...#YYY#...',
    '.....#.....',
  ],
  'race-target': [
    '....#C#....',
    '...#CCC#...',
    '..#CCCCC#..',
    '.#CCCCCCC#.',
    '.#CWWWWW#.',
    '.#CWWWWW#.',
    '.#CWWWWW#.',
    '.#CCCCCCC#.',
    '..#CCCCC#..',
    '...#CCC#...',
    '....#D#....',
    '....#D#....',
    '....#D#....',
    '...##D##...',
  ],
  'jump-player': [
    '.....#.....',
    '....#O#....',
    '...#OOO#...',
    '..#OWBWO#..',
    '..#OWBWO#..',
    '..#OOOOO#..',
    '...#OOO#...',
    '..#OOOOO#..',
    '.#OOOOOOO#.',
    '..#O...O#..',
    '..#O...O#..',
    '...#...#...',
  ],
  'jump-ground': [
    '#############',
    '#DDDDDDDDDDD#',
    '#DdDdDdDdDdD#',
    '#DDDDDDDDDDD#',
    '#DdHHdHHdHHd#',
    '#DDDDDDDDDDD#',
    '#DdDdDdDdDdD#',
    '#############',
  ],
  'balance-needle': [
    '......#......',
    '.....#V#.....',
    '....#VVV#....',
    '...#VVVVV#...',
    '..#VVVVVVV#..',
    '...#VVVVV#...',
    '....#VVV#....',
    '.....#V#.....',
    '......#......',
    '......#......',
    '......#......',
    '......#......',
  ],
  'balance-zone': [
    '..............',
    '..##########..',
    '.#AAAAAAAAAA#.',
    '#AAAAAAAAAAAA#',
    '#AAAAAAAAAAAA#',
    '.#AAAAAAAAAA#.',
    '..##########..',
    '..............',
  ],
  'stars-star': [
    '.....#.....',
    '....#S#....',
    '...#SSS#...',
    '..#SSSSS#..',
    '.#SSSSSSS#.',
    '#SSSSSSSSS#',
    '..#SSSSS#..',
    '...#SSS#...',
    '..#SSSSS#..',
    '.#S#...#S#.',
    '.#S#...#S#.',
  ],
}

const thumbsOnly = process.argv.includes('--thumbs')

if (!thumbsOnly) {
  console.log('Generating pixel sprites:')
  for (const [name, rows] of Object.entries(sprites)) {
    const scale = name === 'jump-ground' || name === 'catch-paddle' || name === 'balance-zone' ? 4 : 3
    saveArt(name, rows, scale)
  }
  console.log('Done -> public/assets/sprites/')
}

/** Magenta-keyed cute thumbs for flap / swipe / hold (feed + catalog). */
const thumbs = {
  flap: [
    'MMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMM#####MMMMMMM',
    'MMMMMMMMMMM#HHHHH#MMMMMM',
    'MMMMM#YY#MM#HHHHH#MMMMMM',
    'MMMM#YWWY#M#HHHHH#MMMMMM',
    'MMMM#YBBY#M#HHHHH#MMMMMM',
    'MMMM#YWWY#M########MMMMM',
    'MMMMM#YY#MMMMMMMMMMMMMMM',
    'MMMMMM##MMMMM#####MMMMMM',
    'MMMMMMMMMMMM#HHHHH#MMMMM',
    'MMMMMMMMMMMM#HHHHH#MMMMM',
    'MMMMMMMMMMMM#HHHHH#MMMMM',
    'MMMMMMMMMMMM#HHHHH#MMMMM',
    'MMMMMMMMMMMMM#####MMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  swipe: [
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MMMM#O#MMMMMM#MMMMM',
    'MMMM#MMM#OOO#MMMMM#MMMMM',
    'MMMM#MMM#OWO#MMMMM#MMMMM',
    'MMMM#MMM#OOO#MMMMM#MMMMM',
    'MMMM#MMMM#C#MMMMMM#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MM#RR#MMMMMMM#MMMMM',
    'MMMM#MM#RR#MMMMMMM#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MMMMMMMM#YY#M#MMMMM',
    'MMMM#MMMMMMMM#YY#M#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
    'MMMM#MMMMMM#MMMMMM#MMMMM',
  ],
  hold: [
    'MMMMMMMMMMMMMMMMMMMMMMMM',
    'MMM##MMMMMMMMMMMMMMMMMMM',
    'MM#PP#MMMMMM#####MMMMMMM',
    'MM#PP#MMMMM#WWWWW#MMMMMM',
    'MM#PP#MMMMM#WBWBW#MMMMMM',
    'MM#WW#MMMMM#WWWWW#MMMMMM',
    'MM#WW#MMMMMM#####MMMMMMM',
    'MM#WW#MMMMMMMM#MMMMMMMMM',
    'MM####MMMMMMM#E#MMMMMMMM',
    'MMMMM#MMMMMM#EEE#MMMMMMM',
    'MMMMM#MMMMM#EEEEE#MMMMMM',
    'MMMMMMMMMMM#EEEEE#MMMMMM',
    'MMMMMMMMMMMM#EEE#MMMMMMM',
    'MMMMMMMMMMMMM#E#MMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMM',
  ],
}

console.log('Generating pixel thumbs:')
for (const [name, rows] of Object.entries(thumbs)) {
  saveThumb(name, rows, 8)
}
console.log('Done -> public/assets/thumbs/')
