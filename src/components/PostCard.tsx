import { CONTENT_TYPE_META, PLATFORM_META, STATUS_META } from '../constants'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  onClick: () => void
  compact?: boolean
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
}

export function PostCard({ post, onClick, compact, draggable, onDragStart }: PostCardProps) {
  const statusMeta = STATUS_META[post.status]
  return (
    <button
      type="button"
      className={`post-card${compact ? ' post-card--compact' : ''}`}
      style={{ borderLeftColor: statusMeta.color }}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="post-card__platforms">
        {post.platforms.map((platform) => (
          <span key={platform} title={PLATFORM_META[platform].label} className="post-card__platform-dot" style={{ background: PLATFORM_META[platform].color }}>
            {PLATFORM_META[platform].emoji}
          </span>
        ))}
        <span className="post-card__type" title={CONTENT_TYPE_META[post.contentType].label}>
          {CONTENT_TYPE_META[post.contentType].emoji}
        </span>
      </div>
      <div className="post-card__title">{post.title || 'Sin título'}</div>
      {!compact && post.time && <div className="post-card__time">🕒 {post.time}</div>}
    </button>
  )
}
