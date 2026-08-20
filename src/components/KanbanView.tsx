import { useMemo } from 'react'
import type { Post, PostStatus } from '../types'
import { STATUS_META, STATUS_ORDER } from '../constants'
import { PostCard } from './PostCard'

interface KanbanViewProps {
  posts: Post[]
  onSelectPost: (post: Post) => void
  onChangeStatus: (id: string, status: PostStatus) => void
}

export function KanbanView({ posts, onSelectPost, onChangeStatus }: KanbanViewProps) {
  const grouped = useMemo(() => {
    const map = new Map<PostStatus, Post[]>()
    for (const status of STATUS_ORDER) map.set(status, [])
    for (const post of posts) {
      map.get(post.status)?.push(post)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.date.localeCompare(b.date))
    }
    return map
  }, [posts])

  function handleDrop(e: React.DragEvent, status: PostStatus) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/post-id')
    if (id) onChangeStatus(id, status)
  }

  return (
    <div className="kanban-view">
      {STATUS_ORDER.map((status) => {
        const list = grouped.get(status) ?? []
        const meta = STATUS_META[status]
        return (
          <div
            key={status}
            className="kanban-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="kanban-column__header" style={{ borderTopColor: meta.color }}>
              <span>{meta.label}</span>
              <span className="kanban-column__count">{list.length}</span>
            </div>
            <div className="kanban-column__body">
              {list.length === 0 && <div className="kanban-column__empty">Sin publicaciones</div>}
              {list.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/post-id', post.id)}
                  onClick={() => onSelectPost(post)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
