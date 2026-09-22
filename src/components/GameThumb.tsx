import { useEffect, useState } from 'react'
import { peekProcessedThumb, processedThumbUrl } from '../games/assets'

interface Props {
  id: string
  src: string
  title: string
  size?: 'feed' | 'saved' | 'tile'
}

function initials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return title.slice(0, 2).toUpperCase()
}

export default function GameThumb({ id, src, title, size = 'feed' }: Props) {
  const [url, setUrl] = useState<string | null>(() => peekProcessedThumb(src) ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    setFailed(false)
    const cached = peekProcessedThumb(src)
    if (cached) {
      setUrl(cached)
      return
    }
    setUrl(null)
    processedThumbUrl(src)
      .then((u) => {
        if (alive) setUrl(u)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [src])

  if (failed) {
    return (
      <div
        className={`thumb-fallback thumb-fallback--${id} thumb-fallback--${size}`}
        aria-hidden="true"
      >
        {initials(title)}
      </div>
    )
  }

  if (!url) {
    return (
      <div
        className={`thumb-img thumb-img--${size} thumb-pending`}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      className={`thumb-img thumb-img--${size}`}
      src={url}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
