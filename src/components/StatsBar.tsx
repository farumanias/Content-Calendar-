import { useMemo } from 'react'
import type { Post } from '../types'
import { STATUS_META, STATUS_ORDER } from '../constants'
import { addDays, todayISO } from '../utils/date'

interface StatsBarProps {
  posts: Post[]
}

export function StatsBar({ posts }: StatsBarProps) {
  const stats = useMemo(() => {
    const today = todayISO()
    const weekEnd = addDays(today, 7)
    const thisWeek = posts.filter((p) => p.date >= today && p.date <= weekEnd).length
    const byStatus = new Map<string, number>()
    for (const status of STATUS_ORDER) byStatus.set(status, 0)
    for (const p of posts) byStatus.set(p.status, (byStatus.get(p.status) ?? 0) + 1)
    return { total: posts.length, thisWeek, byStatus }
  }, [posts])

  return (
    <div className="stats-bar">
      <div className="stat-pill stat-pill--total">
        <span className="stat-pill__value">{stats.total}</span>
        <span className="stat-pill__label">Total</span>
      </div>
      <div className="stat-pill">
        <span className="stat-pill__value">{stats.thisWeek}</span>
        <span className="stat-pill__label">Próximos 7 días</span>
      </div>
      {STATUS_ORDER.map((status) => (
        <div key={status} className="stat-pill" style={{ borderColor: STATUS_META[status].color }}>
          <span className="stat-pill__value" style={{ color: STATUS_META[status].color }}>
            {stats.byStatus.get(status) ?? 0}
          </span>
          <span className="stat-pill__label">{STATUS_META[status].label}</span>
        </div>
      ))}
    </div>
  )
}
