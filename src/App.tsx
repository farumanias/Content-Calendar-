import { useMemo, useRef, useState } from 'react'
import { usePosts } from './hooks/usePosts'
import { CalendarView } from './components/CalendarView'
import { KanbanView } from './components/KanbanView'
import { PostModal } from './components/PostModal'
import { FilterBar, type Filters } from './components/FilterBar'
import { StatsBar } from './components/StatsBar'
import { exportCSV, exportJSON, parseImportedJSON } from './utils/exportImport'
import type { Post, PostDraft } from './types'

type ViewMode = 'calendar' | 'kanban'

const EMPTY_FILTERS: Filters = { search: '', platforms: [], statuses: [] }

export default function App() {
  const { posts, addPost, updatePost, deletePost, duplicatePost, setPostStatus, setPostDate, replaceAll } =
    usePosts()
  const [view, setView] = useState<ViewMode>('calendar')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [modalState, setModalState] = useState<{ open: boolean; post: Post | null; defaultDate?: string }>({
    open: false,
    post: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return posts.filter((post) => {
      if (filters.platforms.length > 0 && !post.platforms.some((p) => filters.platforms.includes(p))) {
        return false
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(post.status)) {
        return false
      }
      if (search) {
        const haystack = `${post.title} ${post.copy} ${post.hashtags.join(' ')}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [posts, filters])

  function openNewPost(defaultDate?: string) {
    setModalState({ open: true, post: null, defaultDate })
  }

  function openEditPost(post: Post) {
    setModalState({ open: true, post })
  }

  function closeModal() {
    setModalState({ open: false, post: null })
  }

  function handleSave(draft: PostDraft) {
    if (modalState.post) {
      updatePost(modalState.post.id, draft)
    } else {
      addPost(draft)
    }
    closeModal()
  }

  function handleDelete() {
    if (modalState.post) {
      deletePost(modalState.post.id)
      closeModal()
    }
  }

  function handleDuplicate() {
    if (modalState.post) {
      duplicatePost(modalState.post.id)
      closeModal()
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const imported = parseImportedJSON(text)
      const merged = [...posts]
      for (const p of imported) {
        if (!merged.some((existing) => existing.id === p.id)) merged.push(p)
      }
      replaceAll(merged)
      setImportError(null)
    } catch {
      setImportError('No se pudo importar el archivo. Verifica que sea un JSON exportado desde esta app.')
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo">🗓️</span>
          <h1>Calendario de Contenido</h1>
        </div>
        <div className="app__view-switch">
          <button
            type="button"
            className={`view-tab${view === 'calendar' ? ' view-tab--active' : ''}`}
            onClick={() => setView('calendar')}
          >
            Calendario
          </button>
          <button
            type="button"
            className={`view-tab${view === 'kanban' ? ' view-tab--active' : ''}`}
            onClick={() => setView('kanban')}
          >
            Tablero
          </button>
        </div>
        <div className="app__actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => exportCSV(filteredPosts)}>
            Exportar CSV
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => exportJSON(posts)}>
            Exportar JSON
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={handleImportClick}>
            Importar JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
          <button type="button" className="btn btn--primary" onClick={() => openNewPost()}>
            + Nueva publicación
          </button>
        </div>
      </header>

      {importError && <div className="import-error">{importError}</div>}

      <StatsBar posts={posts} />
      <FilterBar filters={filters} onChange={setFilters} />

      <main className="app__main">
        {view === 'calendar' ? (
          <CalendarView
            posts={filteredPosts}
            onSelectPost={openEditPost}
            onCreatePost={openNewPost}
            onMovePost={setPostDate}
          />
        ) : (
          <KanbanView posts={filteredPosts} onSelectPost={openEditPost} onChangeStatus={setPostStatus} />
        )}
      </main>

      {modalState.open && (
        <PostModal
          post={modalState.post}
          defaultDate={modalState.defaultDate}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={modalState.post ? handleDelete : undefined}
          onDuplicate={modalState.post ? handleDuplicate : undefined}
        />
      )}
    </div>
  )
}
