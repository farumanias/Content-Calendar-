import type { ContentType, Platform, PostStatus } from './types'

export const PLATFORM_META: Record<Platform, { label: string; color: string; emoji: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C', emoji: '📸' },
  facebook: { label: 'Facebook', color: '#1877F2', emoji: '📘' },
  twitter: { label: 'X / Twitter', color: '#14171A', emoji: '✖️' },
  tiktok: { label: 'TikTok', color: '#010101', emoji: '🎵' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', emoji: '💼' },
  youtube: { label: 'YouTube', color: '#FF0000', emoji: '▶️' },
  pinterest: { label: 'Pinterest', color: '#E60023', emoji: '📌' },
}

export const PLATFORM_ORDER: Platform[] = [
  'instagram',
  'facebook',
  'twitter',
  'tiktok',
  'linkedin',
  'youtube',
  'pinterest',
]

export const CONTENT_TYPE_META: Record<ContentType, { label: string; emoji: string }> = {
  post: { label: 'Publicación', emoji: '🖼️' },
  reel: { label: 'Reel', emoji: '🎬' },
  story: { label: 'Historia', emoji: '⚡' },
  video: { label: 'Video', emoji: '📹' },
  carousel: { label: 'Carrusel', emoji: '🎠' },
  live: { label: 'En vivo', emoji: '🔴' },
  articulo: { label: 'Artículo', emoji: '📝' },
}

export const CONTENT_TYPE_ORDER: ContentType[] = [
  'post',
  'reel',
  'story',
  'video',
  'carousel',
  'live',
  'articulo',
]

export const STATUS_META: Record<PostStatus, { label: string; color: string }> = {
  idea: { label: 'Idea', color: '#9AA0A6' },
  diseno: { label: 'En diseño', color: '#F2A93B' },
  programado: { label: 'Programado', color: '#3B82F6' },
  publicado: { label: 'Publicado', color: '#22C55E' },
}

export const STATUS_ORDER: PostStatus[] = ['idea', 'diseno', 'programado', 'publicado']

export const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
