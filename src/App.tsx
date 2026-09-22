import { useEffect, useRef, useState } from 'react'
import Feed from './components/Feed'
import GamePlayer from './components/GamePlayer'
import { applyAccent } from './games/accents'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<HTMLDivElement>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    if (playingId) applyAccent(appRef.current, playingId)
  }, [playingId])

  return (
    <div ref={appRef} className={'app' + (playingId ? ' app--playing' : '')}>
      <div className="kaplay-wrap" style={{ zIndex: playingId ? 20 : 0 }}>
        <canvas ref={canvasRef} />
      </div>
      <Feed playingId={playingId} onEnter={setPlayingId} />
      {playingId && (
        <GamePlayer
          key={playingId}
          gameId={playingId}
          canvasRef={canvasRef}
          onExit={() => setPlayingId(null)}
        />
      )}
    </div>
  )
}
