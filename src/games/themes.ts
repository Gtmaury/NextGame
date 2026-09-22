export type Rgb = [number, number, number]

export interface GameTheme {
  bg: Rgb
  primary: Rgb
  secondary: Rgb
  danger: Rgb
  muted: Rgb
  ground?: Rgb
  hint: string
}

/** Matches shell `--bg-deep` (#0c0b0a) */
export const DEFAULT_BG: Rgb = [12, 11, 10]

const fallback: GameTheme = {
  bg: DEFAULT_BG,
  primary: [245, 240, 232],
  secondary: [224, 155, 61], // shell amber accent
  danger: [232, 120, 110],
  muted: [154, 163, 173],
  hint: '',
}

export const themes: Record<string, GameTheme> = {
  catch: {
    bg: [26, 16, 32],
    primary: [252, 231, 243],
    secondary: [52, 211, 153],
    danger: [251, 113, 133],
    muted: [196, 160, 180],
    hint: 'Mueve el ratón o usa ← →',
  },
  tapdot: {
    bg: [12, 18, 32],
    primary: [255, 236, 150],
    secondary: [56, 189, 248],
    danger: [251, 113, 133],
    muted: [148, 163, 184],
    hint: 'Clic o toca el punto a tiempo',
  },
  race: {
    bg: [10, 22, 40],
    primary: [186, 230, 253],
    secondary: [56, 189, 248],
    danger: [251, 113, 133],
    muted: [125, 160, 190],
    hint: 'Clic rápido en los blancos',
  },
  dodge: {
    bg: [20, 10, 18],
    primary: [167, 243, 208],
    secondary: [52, 211, 153],
    danger: [248, 113, 113],
    muted: [180, 140, 150],
    hint: 'Mueve el ratón o usa ← →',
  },
  jump: {
    bg: [18, 12, 10],
    primary: [253, 230, 138],
    secondary: [224, 155, 61],
    danger: [232, 120, 110],
    muted: [154, 163, 173],
    ground: [72, 48, 36],
    hint: 'Clic o espacio para saltar · mantén para subir',
  },
  balance: {
    bg: [16, 14, 18],
    primary: [230, 236, 242],
    secondary: [125, 160, 190],
    danger: [232, 120, 110],
    muted: [154, 163, 173],
    hint: 'Mantén clic o espacio para equilibrar',
  },
  stars: {
    bg: [10, 10, 14],
    primary: [254, 240, 138],
    secondary: [224, 155, 61],
    danger: [232, 120, 110],
    muted: [154, 163, 173],
    hint: 'Clic en las doradas, evita las rojas',
  },
  slice: {
    bg: [22, 10, 14],
    primary: [255, 228, 232],
    secondary: [244, 63, 94],
    danger: [251, 113, 133],
    muted: [180, 140, 150],
    hint: 'Arrastra el ratón para cortar',
  },
  stack: {
    bg: [14, 10, 24],
    primary: [237, 233, 254],
    secondary: [167, 139, 250],
    danger: [251, 113, 133],
    muted: [160, 150, 190],
    hint: 'Clic o espacio para apilar',
  },
  memory: {
    bg: [8, 18, 18],
    primary: [204, 251, 241],
    secondary: [45, 212, 191],
    danger: [251, 113, 133],
    muted: [140, 170, 165],
    hint: 'Clic en las teclas · 1-4',
  },
  flap: {
    bg: [12, 14, 28],
    primary: [224, 231, 255],
    secondary: [129, 140, 248],
    danger: [251, 113, 133],
    muted: [148, 163, 184],
    hint: 'Clic o espacio para aletear',
  },
  swipe: {
    bg: [18, 12, 8],
    primary: [255, 237, 213],
    secondary: [251, 146, 60],
    danger: [248, 113, 113],
    muted: [180, 150, 130],
    hint: 'Arrastra o usa ← →',
  },
  hold: {
    bg: [22, 10, 18],
    primary: [252, 231, 243],
    secondary: [244, 114, 182],
    danger: [251, 113, 133],
    muted: [190, 150, 170],
    hint: 'Mantén clic o espacio · suelta para lanzar',
  },
}

export function getTheme(id: string): GameTheme {
  return themes[id] ?? fallback
}
