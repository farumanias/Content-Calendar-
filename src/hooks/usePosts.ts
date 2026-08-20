import { useCallback, useEffect, useState } from 'react'
import type { Post, PostDraft } from '../types'
import { generateId } from '../utils/id'
import { buildSeedPosts } from '../seedData'

const STORAGE_KEY = 'content-calendar:posts:v1'

function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildSeedPosts()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return buildSeedPosts()
    return parsed as Post[]
  } catch {
    return buildSeedPosts()
  }
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(() => loadPosts())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  const addPost = useCallback((draft: PostDraft) => {
    const now = new Date().toISOString()
    const newPost: Post = {
      ...draft,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setPosts((prev) => [...prev, newPost])
    return newPost
  }, [])

  const updatePost = useCallback((id: string, draft: PostDraft) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...draft, updatedAt: new Date().toISOString() } : p)),
    )
  }, [])

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const duplicatePost = useCallback((id: string) => {
    setPosts((prev) => {
      const original = prev.find((p) => p.id === id)
      if (!original) return prev
      const now = new Date().toISOString()
      const copy: Post = {
        ...original,
        id: generateId(),
        title: `${original.title} (copia)`,
        status: 'idea',
        createdAt: now,
        updatedAt: now,
      }
      return [...prev, copy]
    })
  }, [])

  const setPostStatus = useCallback((id: string, status: Post['status']) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p)),
    )
  }, [])

  const setPostDate = useCallback((id: string, date: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, date, updatedAt: new Date().toISOString() } : p)),
    )
  }, [])

  const replaceAll = useCallback((next: Post[]) => {
    setPosts(next)
  }, [])

  return { posts, addPost, updatePost, deletePost, duplicatePost, setPostStatus, setPostDate, replaceAll }
}
