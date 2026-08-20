import { useEffect, useState } from 'react'
import type { ContentType, Platform, Post, PostDraft, PostStatus } from '../types'
import { CONTENT_TYPE_META, CONTENT_TYPE_ORDER, PLATFORM_META, PLATFORM_ORDER, STATUS_META, STATUS_ORDER } from '../constants'
import { todayISO } from '../utils/date'

interface PostModalProps {
  post: Post | null
  defaultDate?: string
  onClose: () => void
  onSave: (draft: PostDraft) => void
  onDelete?: () => void
  onDuplicate?: () => void
}

function emptyDraft(defaultDate?: string): PostDraft {
  return {
    title: '',
    copy: '',
    platforms: [],
    contentType: 'post',
    date: defaultDate ?? todayISO(),
    time: '',
    status: 'idea',
    hashtags: [],
    link: '',
    notes: '',
  }
}

export function PostModal({ post, defaultDate, onClose, onSave, onDelete, onDuplicate }: PostModalProps) {
  const [draft, setDraft] = useState<PostDraft>(() =>
    post
      ? {
          title: post.title,
          copy: post.copy,
          platforms: post.platforms,
          contentType: post.contentType,
          date: post.date,
          time: post.time,
          status: post.status,
          hashtags: post.hashtags,
          link: post.link,
          notes: post.notes,
        }
      : emptyDraft(defaultDate),
  )
  const [hashtagsText, setHashtagsText] = useState(draft.hashtags.join(', '))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function togglePlatform(platform: Platform) {
    setDraft((d) => ({
      ...d,
      platforms: d.platforms.includes(platform)
        ? d.platforms.filter((p) => p !== platform)
        : [...d.platforms, platform],
    }))
  }

  function handleSave() {
    if (!draft.title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    if (draft.platforms.length === 0) {
      setError('Selecciona al menos una red social.')
      return
    }
    const hashtags = hashtagsText
      .split(',')
      .map((h) => h.trim().replace(/^#/, ''))
      .filter(Boolean)
    onSave({ ...draft, hashtags })
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{post ? 'Editar publicación' : 'Nueva publicación'}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal__body">
          <label className="field">
            <span>Título</span>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Ej. Lanzamiento de colección de verano"
              autoFocus
            />
          </label>

          <label className="field">
            <span>Texto / copy</span>
            <textarea
              value={draft.copy}
              onChange={(e) => setDraft((d) => ({ ...d, copy: e.target.value }))}
              placeholder="Redacta el texto de la publicación..."
              rows={4}
            />
          </label>

          <div className="field">
            <span>Redes sociales</span>
            <div className="chip-group">
              {PLATFORM_ORDER.map((platform) => (
                <button
                  type="button"
                  key={platform}
                  className={`chip${draft.platforms.includes(platform) ? ' chip--active' : ''}`}
                  style={draft.platforms.includes(platform) ? { background: PLATFORM_META[platform].color, borderColor: PLATFORM_META[platform].color } : undefined}
                  onClick={() => togglePlatform(platform)}
                >
                  {PLATFORM_META[platform].emoji} {PLATFORM_META[platform].label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Tipo de contenido</span>
              <select
                value={draft.contentType}
                onChange={(e) => setDraft((d) => ({ ...d, contentType: e.target.value as ContentType }))}
              >
                {CONTENT_TYPE_ORDER.map((type) => (
                  <option key={type} value={type}>
                    {CONTENT_TYPE_META[type].emoji} {CONTENT_TYPE_META[type].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estado</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as PostStatus }))}
              >
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_META[status].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Fecha</span>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>Hora (opcional)</span>
              <input
                type="time"
                value={draft.time}
                onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
              />
            </label>
          </div>

          <label className="field">
            <span>Hashtags (separados por coma)</span>
            <input
              type="text"
              value={hashtagsText}
              onChange={(e) => setHashtagsText(e.target.value)}
              placeholder="marca, novedad, oferta"
            />
          </label>

          <label className="field">
            <span>Enlace (opcional)</span>
            <input
              type="text"
              value={draft.link}
              onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
              placeholder="https://..."
            />
          </label>

          <label className="field">
            <span>Notas internas</span>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              placeholder="Recordatorios, pendientes de aprobación, assets necesarios..."
              rows={2}
            />
          </label>

          {error && <div className="form-error">{error}</div>}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-left">
            {post && onDelete && (
              <button type="button" className="btn btn--danger" onClick={onDelete}>
                Eliminar
              </button>
            )}
            {post && onDuplicate && (
              <button type="button" className="btn btn--ghost" onClick={onDuplicate}>
                Duplicar
              </button>
            )}
          </div>
          <div className="modal__footer-right">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn--primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
