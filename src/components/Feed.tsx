import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { applyAccent } from '../games/accents'
import { gameIds, gameMeta, shuffle } from '../games/meta'
import { getSaved, isSaved, toggleSaved } from '../runtime/saved'
import { preloadGame } from '../runtime/preload'
import { isPremium } from '../runtime/premium'
import { getAttempts } from '../runtime/attempts'
import { getHighScore } from '../runtime/highscore'
import {
  attemptsCount,
  gameTitle,
  recordLabel,
  t,
} from '../i18n'
import { useLocale } from '../hooks/useLocale'
import GameThumb from './GameThumb'
import LanguageBar from './LanguageBar'

const DESKTOP_MQ = '(min-width: 900px)'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 11 9" aria-hidden="true">
      <path
        fill="currentColor"
        opacity={filled ? 1 : 0.55}
        d="M2 0h3v1h1v1h1V1h1V0h3v1h1v3H10v1H9v1H8v1H7v1H6v1H5V7H4V6H3V5H2V4H1V3H0V1h1V0h1z"
      />
    </svg>
  )
}

function HeartSaveButton({
  saved,
  onToggle,
}: {
  saved: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={'heart-btn' + (saved ? ' on' : '')}
      aria-label={saved ? t('saved') : t('save')}
      aria-pressed={saved}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      <HeartIcon filled={saved} />
    </button>
  )
}

const BINANCE_EMAIL = 'gtmauan@gmail.com'

function DonateButton() {
  useLocale()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: Event) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(BINANCE_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="donate-wrap" ref={wrapRef}>
      <button
        type="button"
        className={'donate-btn' + (open ? ' on' : '')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {t('donate')}
      </button>
      {open && (
        <div className="donate-pop" role="dialog" aria-label={t('donate')}>
          <p className="donate-line">
            Binance: {BINANCE_EMAIL}
          </p>
          <button type="button" className="donate-copy" onClick={copyEmail}>
            {copied ? t('donateCopied') : t('donateCopy')}
          </button>
        </div>
      )}
    </div>
  )
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const onChange = () => setDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return desktop
}

interface Props {
  playingId: string | null
  onEnter: (id: string) => void
}

export default function Feed({ playingId, onEnter }: Props) {
  const [tab, setTab] = useState<'feed' | 'saved' | 'scores'>('feed')
  const [premium] = useState(isPremium())
  const [attempts, setAttempts] = useState(getAttempts())
  const [accentId, setAccentId] = useState(gameIds[0] ?? 'jump')
  const screenRef = useRef<HTMLDivElement>(null)
  const desktop = useIsDesktop()
  useLocale()

  useEffect(() => {
    if (playingId === null) {
      setAttempts(getAttempts())
    }
  }, [playingId])

  useEffect(() => {
    if (playingId) return
    applyAccent(screenRef.current, accentId)
  }, [accentId, playingId, tab])

  return (
    <div className={'feed-screen' + (desktop ? ' feed-screen--desktop' : '')} ref={screenRef}>
      <header className="feed-header">
        <span className="brand">NextGame</span>
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'feed'}
            className={tab === 'feed' ? 'active' : ''}
            onClick={() => setTab('feed')}
          >
            {t('tabPlay')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'saved'}
            className={tab === 'saved' ? 'active' : ''}
            onClick={() => setTab('saved')}
          >
            {t('tabSaved')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'scores'}
            className={tab === 'scores' ? 'active' : ''}
            onClick={() => setTab('scores')}
          >
            {t('tabScores')}
          </button>
        </div>
        <div className="feed-header-end">
          <span className="attempts-chip" aria-label={t('attemptsAria')}>
            {premium ? t('attemptsInfinite') : attemptsCount(attempts)}
          </span>
          <DonateButton />
        </div>
      </header>

      {tab === 'feed' ? (
        desktop ? (
          <GameCatalog onEnter={onEnter} onVisibleId={setAccentId} />
        ) : (
          <GameFeed onEnter={onEnter} onVisibleId={setAccentId} />
        )
      ) : tab === 'saved' ? (
        <SavedList onEnter={onEnter} />
      ) : (
        <ScoresList />
      )}
      <LanguageBar />
    </div>
  )
}

function GameFeed({
  onEnter,
  onVisibleId,
}: {
  onEnter: (id: string) => void
  onVisibleId: (id: string) => void
}) {
  const [order] = useState(() => shuffle(gameIds))
  const [index, setIndex] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)

  const len = order.length
  const wrapped = ((index % len) + len) % len
  const visibleId = order[wrapped]
  useLocale()

  useEffect(() => {
    onVisibleId(visibleId)
  }, [visibleId, onVisibleId])

  useEffect(() => {
    preloadGame(order[(wrapped + 1) % len])
  }, [wrapped, order, len])

  function next() {
    setIndex((i) => i + 1)
  }
  function prev() {
    setIndex((i) => i - 1)
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    start.current = { x: e.clientX, y: e.clientY }
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!start.current) return
    if ((e.target as HTMLElement).closest('button')) {
      start.current = null
      return
    }
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    start.current = null
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
      if (dy < 0) next()
      else prev()
    } else if (Math.abs(dy) < 12 && Math.abs(dx) < 12) {
      onEnter(order[wrapped])
    }
  }

  return (
    <div
      className="game-feed"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onWheel={(e) => {
        if (e.deltaY > 0) next()
        else if (e.deltaY < 0) prev()
      }}
    >
      <GameCard key={wrapped} id={order[wrapped]} onEnter={onEnter} />
      <div className="feed-hint">{t('feedHint')}</div>
    </div>
  )
}

function GameCard({ id, onEnter }: { id: string; onEnter: (id: string) => void }) {
  const meta = gameMeta[id]
  const [saved, setSaved] = useState(isSaved(id))
  const record = meta ? getHighScore(id) : 0
  const variant = meta ? `card--${id}` : 'card--default'
  const title = gameTitle(id)
  useLocale()

  if (!meta) return null

  return (
    <div className={`game-card ${variant}`}>
      <div className="card-panel">
        <GameThumb id={id} src={meta.thumbnail} title={title} />
        <h2>{title}</h2>
        {record > 0 && <div className="record-chip">🏆 {recordLabel(record)}</div>}
        <div className="card-actions">
          <HeartSaveButton
            saved={saved}
            onToggle={() => setSaved(toggleSaved(id))}
          />
          <button
            type="button"
            className="play-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEnter(id)
            }}
          >
            {t('play')}
          </button>
        </div>
      </div>
    </div>
  )
}

function GameCatalog({
  onEnter,
  onVisibleId,
}: {
  onEnter: (id: string) => void
  onVisibleId: (id: string) => void
}) {
  const [order] = useState(() => shuffle(gameIds))
  const featuredId = useMemo(() => {
    let best = order[0]
    let bestScore = 0
    for (const id of order) {
      const s = getHighScore(id)
      if (s > bestScore) {
        bestScore = s
        best = id
      }
    }
    return best
  }, [order])
  const rest = useMemo(() => order.filter((id) => id !== featuredId), [order, featuredId])
  const shelfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onVisibleId(featuredId)
  }, [featuredId, onVisibleId])

  useEffect(() => {
    rest.slice(0, 4).forEach(preloadGame)
  }, [rest])

  useEffect(() => {
    const el = shelfRef.current
    if (!el) return

    let target = el.scrollLeft
    let current = el.scrollLeft
    let raf = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = 0.14

    function maxScroll() {
      return Math.max(0, el.scrollWidth - el.clientWidth)
    }

    function tick() {
      const diff = target - current
      if (Math.abs(diff) < 0.35) {
        current = target
        el.scrollLeft = current
        raf = 0
        return
      }
      current += diff * ease
      el.scrollLeft = current
      raf = requestAnimationFrame(tick)
    }

    function wheelPx(e: WheelEvent) {
      let dx = e.deltaX
      let dy = e.deltaY
      if (e.deltaMode === 1) {
        dx *= 16
        dy *= 16
      } else if (e.deltaMode === 2) {
        dx *= el.clientWidth
        dy *= el.clientHeight
      }
      return { dx, dy }
    }

    const onWheel = (e: WheelEvent) => {
      const { dx, dy } = wheelPx(e)
      if (Math.abs(dy) < Math.abs(dx)) return
      e.preventDefault()
      const delta = dy
      if (reduceMotion) {
        el.scrollLeft = Math.max(0, Math.min(maxScroll(), el.scrollLeft + delta))
        target = el.scrollLeft
        current = el.scrollLeft
        return
      }
      if (!raf) {
        current = el.scrollLeft
        target = el.scrollLeft
      }
      target = Math.max(0, Math.min(maxScroll(), target + delta))
      if (!raf) raf = requestAnimationFrame(tick)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* Win8 packing: wide under the 2×2, then a stacked column of smalls, then another large. */
  const TILE_SIZES = ['md', 'sm', 'sm', 'sm', 'lg', 'md', 'sm', 'sm', 'lg', 'sm', 'md', 'sm'] as const

  return (
    <div className="game-catalog">
      <div className="catalog-shelf" ref={shelfRef}>
        <CatalogCard id={featuredId} featured onEnter={onEnter} onHover={onVisibleId} />
        {rest.map((id, i) => (
          <CatalogCard
            key={id}
            id={id}
            tileSize={TILE_SIZES[i % TILE_SIZES.length]}
            onEnter={onEnter}
            onHover={onVisibleId}
          />
        ))}
      </div>
    </div>
  )
}

function CatalogCard({
  id,
  featured = false,
  tileSize = 'md',
  onEnter,
  onHover,
}: {
  id: string
  featured?: boolean
  tileSize?: 'lg' | 'md' | 'sm'
  onEnter: (id: string) => void
  onHover: (id: string) => void
}) {
  useLocale()
  const title = gameTitle(id)
  const meta = gameMeta[id]
  const [saved, setSaved] = useState(isSaved(id))
  const variant = meta ? `card--${id}` : 'card--default'

  if (!meta) return null

  const className = featured
    ? `catalog-featured ${variant}`
    : `catalog-tile catalog-tile--${tileSize} ${variant}`

  return (
    <article
      className={className}
      tabIndex={0}
      onMouseEnter={() => onHover(id)}
      onClick={() => onEnter(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEnter(id)
        }
      }}
    >
      <HeartSaveButton
        saved={saved}
        onToggle={() => setSaved(toggleSaved(id))}
      />
      <GameThumb
        id={id}
        src={meta.thumbnail}
        title={title}
        size="tile"
      />
      <div className="catalog-copy">
        <h2>{title}</h2>
        {tileSize !== 'sm' && (
          <div className="card-actions">
            <button
              type="button"
              className="play-btn"
              onClick={(e) => {
                e.stopPropagation()
                onEnter(id)
              }}
            >
              {t('play')}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

function SavedList({ onEnter }: { onEnter: (id: string) => void }) {
  const [ids, setIds] = useState<string[]>(() => getSaved())
  useLocale()

  if (ids.length === 0) {
    return (
      <div className="empty">
        <div className="empty-title">{t('emptySavedTitle')}</div>
        <p>{t('emptySavedBody')}</p>
      </div>
    )
  }

  return (
    <div className="saved-list">
      {ids.map((id) => {
        const meta = gameMeta[id]
        if (!meta) return null
        return (
          <div key={id} className={`saved-row saved-row--${id}`} onClick={() => onEnter(id)}>
            <GameThumb id={id} src={meta.thumbnail} title={gameTitle(id)} size="saved" />
            <span className="title">{gameTitle(id)}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleSaved(id)
                setIds(getSaved())
              }}
            >
              {t('remove')}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function ScoresList() {
  useLocale()
  const rows = gameIds
    .map((id) => ({ id, meta: gameMeta[id], score: getHighScore(id) }))
    .filter((r) => r.meta)
    .sort((a, b) => b.score - a.score)
  const topId = rows[0] && rows[0].score > 0 ? rows[0].id : null

  if (rows.every((r) => r.score === 0)) {
    return (
      <div className="empty empty--scores">
        <div className="empty-title">{t('emptyScoresTitle')}</div>
        <p>{t('emptyScoresBody')}</p>
      </div>
    )
  }

  return (
    <div className="scores-list">
      {rows.map((r, i) => (
        <div key={r.id} className={`score-row score-row--${r.id}${r.id === topId ? ' top' : ''}`}>
          <span className="pos">{i + 1}</span>
          <GameThumb id={r.id} src={r.meta.thumbnail} title={gameTitle(r.id)} size="saved" />
          <span className="title">{gameTitle(r.id)}</span>
          <span className="score">
            {r.score > 0 ? `${r.score} pts${r.id === topId ? ' 🏆' : ''}` : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
