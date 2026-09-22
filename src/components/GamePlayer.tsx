import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { getKaplay } from '../runtime/kaplay'
import { loadGame } from '../games/registry'
import { isPremium } from '../runtime/premium'
import { spendAttempt, addAttempts, getAttempts } from '../runtime/attempts'
import { probeOnline } from '../runtime/connection'
import { getHighScore, submitHighScore } from '../runtime/highscore'
import { t } from '../i18n'
import { useLocale } from '../hooks/useLocale'

type Status = 'playing' | 'lost' | 'recovering'

interface Props {
  gameId: string
  canvasRef: RefObject<HTMLCanvasElement>
  onExit: () => void
}

export default function GamePlayer({ gameId, canvasRef, onExit }: Props) {
  useLocale()
  const [status, setStatus] = useState<Status>('playing')
  const [runId, setRunId] = useState(0)
  const [online, setOnline] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [highScore, setHighScore] = useState(0)
  const [isRecord, setIsRecord] = useState(false)

  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | null = null

    async function start() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.tabIndex = 0
      canvas.setAttribute('aria-label', t('game'))
      canvas.focus({ preventScroll: true })
      const k = getKaplay(canvas)
      const def = await loadGame(gameId)
      if (cancelled) return
      try {
        await def.preload(k)
      } catch (err) {
        console.warn('[GamePlayer] preload failed, mounting anyway', err)
      }
      if (cancelled) return
      cleanup = def.mount(k, {
        exit: () => onExit(),
        onLose: (score) => {
          const res = submitHighScore(gameId, score)
          setHighScore(res.highScore)
          setIsRecord(res.isRecord)
          setFinalScore(score)
          setStatus('lost')
        },
      })
    }

    start()

    return () => {
      cancelled = true
      if (cleanup) cleanup()
    }
  }, [gameId, runId])

  function restart() {
    setStatus('playing')
    setFinalScore(null)
    setHighScore(getHighScore(gameId))
    setIsRecord(false)
    setRunId((r) => r + 1)
  }

  async function handleContinue() {
    if (isPremium()) {
      restart()
      return
    }
    if (spendAttempt()) {
      restart()
      return
    }
    setOnline(await probeOnline())
    setStatus('recovering')
  }

  function finishRecovery() {
    addAttempts(1)
    restart()
  }

  return (
    <div className="game-player">
      <button type="button" className="exit-btn" onClick={onExit} aria-label={t('close')}>
        ✕
      </button>

      {status === 'lost' && (
        <div className="overlay">
          <div className="overlay-panel">
            <h2>{t('youLost')}</h2>
            <div className="overlay-stats">
              {finalScore !== null && (
                <p className="overlay-stat">
                  <span className="overlay-stat-label">{t('score')}</span>
                  <span className="overlay-stat-value">
                    {finalScore}
                    {isRecord ? ' 🏆' : ''}
                  </span>
                </p>
              )}
              {finalScore !== null && (
                <p className="overlay-stat">
                  <span className="overlay-stat-label">{t('highScore')}</span>
                  <span className="overlay-stat-value">{highScore}</span>
                </p>
              )}
              <p className="overlay-stat">
                <span className="overlay-stat-label">{t('attempts')}</span>
                <span className="overlay-stat-value">
                  {isPremium() ? '∞' : getAttempts()}
                </span>
              </p>
            </div>
            <div className="overlay-actions">
              <button onClick={handleContinue}>
                {isPremium() ? t('continueInfinite') : t('continueOne')}
              </button>
              <button className="secondary" onClick={onExit}>
                {t('exit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'recovering' && (
        <RecoveryOverlay online={online} onDone={finishRecovery} onCancel={onExit} />
      )}
    </div>
  )
}

function RecoveryOverlay({
  online,
  onDone,
  onCancel,
}: {
  online: boolean
  onDone: () => void
  onCancel: () => void
}) {
  useLocale()
  const [left, setLeft] = useState(online ? 5 : 15)

  useEffect(() => {
    if (online) return
    if (left <= 0) {
      onDone()
      return
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left, online, onDone])

  if (online) {
    return (
      <div className="overlay">
        <div className="overlay-panel">
          <h2>{t('watchAd')}</h2>
          <p>{t('watchAdBody')}</p>
          <div className="overlay-actions">
            <button onClick={onDone}>{t('continuePlus')}</button>
            <button className="secondary" onClick={onCancel}>
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overlay">
      <div className="overlay-panel">
        <h2>{t('wait')}</h2>
        <p>{t('waitBody')}</p>
        <div className="countdown">{left}s</div>
        <div className="overlay-actions">
          <button className="secondary" onClick={onCancel}>
            {t('exit')}
          </button>
        </div>
      </div>
    </div>
  )
}
