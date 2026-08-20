import { generateId } from './utils/id'
import { addDays, todayISO } from './utils/date'
import type { Post } from './types'

const now = new Date().toISOString()

export function buildSeedPosts(): Post[] {
  const today = todayISO()
  const base: Array<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      title: 'Lanzamiento de producto',
      copy: 'Anuncio del nuevo producto con foto principal y llamado a la acción.',
      platforms: ['instagram', 'facebook'],
      contentType: 'post',
      date: addDays(today, 1),
      time: '10:00',
      status: 'programado',
      hashtags: ['lanzamiento', 'novedad'],
      link: '',
      notes: 'Confirmar diseño final con el equipo creativo.',
    },
    {
      title: 'Detrás de cámaras del equipo',
      copy: 'Reel corto mostrando el día a día del equipo en la oficina.',
      platforms: ['tiktok', 'instagram'],
      contentType: 'reel',
      date: addDays(today, 3),
      time: '15:30',
      status: 'diseno',
      hashtags: ['equipo', 'detras-de-camaras'],
      link: '',
      notes: '',
    },
    {
      title: 'Tips de la semana',
      copy: 'Carrusel con 5 tips prácticos relacionados al sector.',
      platforms: ['instagram', 'linkedin'],
      contentType: 'carousel',
      date: addDays(today, -2),
      time: '09:00',
      status: 'publicado',
      hashtags: ['tips', 'consejos'],
      link: '',
      notes: '',
    },
    {
      title: 'Idea: colaboración con influencer',
      copy: 'Explorar colaboración para promocionar la nueva línea.',
      platforms: ['instagram'],
      contentType: 'post',
      date: addDays(today, 10),
      time: '',
      status: 'idea',
      hashtags: [],
      link: '',
      notes: 'Pendiente de aprobación de presupuesto.',
    },
    {
      title: 'Artículo: tendencias del sector',
      copy: 'Publicación en LinkedIn sobre tendencias del próximo trimestre.',
      platforms: ['linkedin'],
      contentType: 'articulo',
      date: addDays(today, 5),
      time: '08:00',
      status: 'programado',
      hashtags: ['tendencias'],
      link: '',
      notes: '',
    },
  ]

  return base.map((p) => ({
    ...p,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }))
}
