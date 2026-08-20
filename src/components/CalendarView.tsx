import { useMemo, useState } from 'react'
import type { Post } from '../types'
import { MONTHS_ES, WEEKDAYS_ES } from '../constants'
import { getMonthGrid, isSameMonth, todayISO, toISODate } from '../utils/date'
import { PostCard } from './PostCard'

interface CalendarViewProps {
  posts: Post[]
  onSelectPost: (post: Post) => void
  onCreatePost: (date: string) => void
  onMovePost: (id: string, date: string) => void
}

export function CalendarView({ posts, onSelectPost, onCreatePost, onMovePost }: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const grid = useMemo(() => getMonthGrid(cursor.year, cursor.month), [cursor])
  const today = todayISO()

  const postsByDate = useMemo(() => {
    const map = new Map<string, Post[]>()
    for (const post of posts) {
      const list = map.get(post.date) ?? []
      list.push(post)
      map.set(post.date, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time))
    }
    return map
  }, [posts])

  function goToday() {
    const now = new Date()
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
  }

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function handleDrop(e: React.DragEvent, date: string) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/post-id')
    if (id) onMovePost(id, date)
  }

  return (
    <div className="calendar-view">
      <div className="calendar-view__toolbar">
        <div className="calendar-view__nav">
          <button type="button" className="icon-button" onClick={() => shiftMonth(-1)} aria-label="Mes anterior">
            ‹
          </button>
          <h2>
            {MONTHS_ES[cursor.month]} {cursor.year}
          </h2>
          <button type="button" className="icon-button" onClick={() => shiftMonth(1)} aria-label="Mes siguiente">
            ›
          </button>
        </div>
        <button type="button" className="btn btn--ghost" onClick={goToday}>
          Hoy
        </button>
      </div>

      <div className="calendar-view__weekdays">
        {WEEKDAYS_ES.map((day) => (
          <div key={day} className="calendar-view__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-view__grid">
        {grid.map((date) => {
          const iso = toISODate(date)
          const inMonth = isSameMonth(date, cursor.year, cursor.month)
          const dayPosts = postsByDate.get(iso) ?? []
          const isToday = iso === today
          return (
            <div
              key={iso}
              className={`calendar-day${inMonth ? '' : ' calendar-day--outside'}${isToday ? ' calendar-day--today' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, iso)}
            >
              <div className="calendar-day__header">
                <span className="calendar-day__number">{date.getDate()}</span>
                <button
                  type="button"
                  className="calendar-day__add"
                  onClick={() => onCreatePost(iso)}
                  aria-label="Añadir publicación"
                >
                  +
                </button>
              </div>
              <div className="calendar-day__posts">
                {dayPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    compact
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
    </div>
  )
}
