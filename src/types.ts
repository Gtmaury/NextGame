export type KaplayCtx = ReturnType<typeof import('kaplay').default>

export interface GameCallbacks {
  exit: () => void
  onLose: (score: number) => void
}

export type LifeModel = 'retry' | 'time'

export interface MiniGameDef {
  id: string
  title: string
  thumbnail: string
  lifeModel: LifeModel
  initialLives: number
  preload: (k: KaplayCtx) => Promise<void>
  mount: (k: KaplayCtx, cb: GameCallbacks) => () => void
}
