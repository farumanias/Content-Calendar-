import type { Platform, PostStatus } from '../types'
import { PLATFORM_META, PLATFORM_ORDER, STATUS_META, STATUS_ORDER } from '../constants'

export interface Filters {
  search: string
  platforms: Platform[]
  statuses: PostStatus[]
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  function togglePlatform(platform: Platform) {
    onChange({
      ...filters,
      platforms: filters.platforms.includes(platform)
        ? filters.platforms.filter((p) => p !== platform)
        : [...filters.platforms, platform],
    })
  }

  function toggleStatus(status: PostStatus) {
    onChange({
      ...filters,
      statuses: filters.statuses.includes(status)
        ? filters.statuses.filter((s) => s !== status)
        : [...filters.statuses, status],
    })
  }

  const hasActiveFilters = filters.search || filters.platforms.length > 0 || filters.statuses.length > 0

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="filter-bar__search"
        placeholder="Buscar por título, texto o hashtag..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <div className="filter-bar__chips">
        {PLATFORM_ORDER.map((platform) => (
          <button
            key={platform}
            type="button"
            className={`chip chip--small${filters.platforms.includes(platform) ? ' chip--active' : ''}`}
            style={filters.platforms.includes(platform) ? { background: PLATFORM_META[platform].color, borderColor: PLATFORM_META[platform].color } : undefined}
            onClick={() => togglePlatform(platform)}
          >
            {PLATFORM_META[platform].emoji} {PLATFORM_META[platform].label}
          </button>
        ))}
      </div>

      <div className="filter-bar__chips">
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            className={`chip chip--small${filters.statuses.includes(status) ? ' chip--active' : ''}`}
            style={filters.statuses.includes(status) ? { background: STATUS_META[status].color, borderColor: STATUS_META[status].color } : undefined}
            onClick={() => toggleStatus(status)}
          >
            {STATUS_META[status].label}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => onChange({ search: '', platforms: [], statuses: [] })}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
