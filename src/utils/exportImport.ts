import type { Post } from '../types'

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportJSON(posts: Post[]) {
  downloadFile(
    `calendario-contenido-${Date.now()}.json`,
    JSON.stringify(posts, null, 2),
    'application/json',
  )
}

const CSV_HEADERS = [
  'title',
  'copy',
  'platforms',
  'contentType',
  'date',
  'time',
  'status',
  'hashtags',
  'link',
  'notes',
]

function escapeCSV(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportCSV(posts: Post[]) {
  const rows = [CSV_HEADERS.join(',')]
  for (const p of posts) {
    rows.push(
      [
        p.title,
        p.copy,
        p.platforms.join('|'),
        p.contentType,
        p.date,
        p.time,
        p.status,
        p.hashtags.join('|'),
        p.link,
        p.notes,
      ]
        .map((v) => escapeCSV(String(v ?? '')))
        .join(','),
    )
  }
  downloadFile(`calendario-contenido-${Date.now()}.csv`, rows.join('\n'), 'text/csv')
}

export function parseImportedJSON(text: string): Post[] {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista de publicaciones.')
  return parsed as Post[]
}
