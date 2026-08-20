export type Platform =
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'pinterest'

export type ContentType =
  | 'post'
  | 'reel'
  | 'story'
  | 'video'
  | 'carousel'
  | 'live'
  | 'articulo'

export type PostStatus = 'idea' | 'diseno' | 'programado' | 'publicado'

export interface Post {
  id: string
  title: string
  copy: string
  platforms: Platform[]
  contentType: ContentType
  date: string // YYYY-MM-DD
  time: string // HH:MM, optional (may be empty)
  status: PostStatus
  hashtags: string[]
  link: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type PostDraft = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
