"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FileItem = {
  id: string
  filename: string
  created_at: number
}

const STORAGE_KEY = "uploaded-files"

export function UploadOffering() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [displayCount, setDisplayCount] = useState(12)

  // Load list from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setFiles(JSON.parse(raw))
  }, [])

  // Save list to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
  }, [files])

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    const rootEl = listRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const [e] = entries
        if (e.isIntersecting) setDisplayCount((c) => c + 10)
      },
      { root: rootEl, rootMargin: "200px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const ordered = useMemo(() => [...files].sort((a, b) => b.created_at - a.created_at), [files])
  const visible = ordered.slice(0, displayCount)

  const beginSelect = () => {
    if (!uploading) inputRef.current?.click()
  }

  const handleFilePicked = (file?: File) => {
    if (!file) return
    setUploading(true)
    setProgress(0)

    const start = Date.now()
    const t = setInterval(() => {
      setProgress((p) => {
        const elapsed = Date.now() - start
        const next = Math.min(98, Math.max(p + Math.random() * 12, elapsed / 50))
        return next
      })
    }, 250)

    const totalDelay = 800 + Math.random() * 1200
    setTimeout(() => {
      clearInterval(t)
      setProgress(100)

      const newFile: FileItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        filename: file.name,
        created_at: Date.now(),
      }
      setFiles((prev) => [newFile, ...prev])

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ""
      }, 350)
    }, totalDelay)
  }

  const formatLine = (f: FileItem) => {
    const d = new Date(f.created_at)
    return `${f.filename} - ${d.toLocaleString()}`
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFilePicked(e.target.files?.[0] || undefined)}
      />

      {/* Upload button */}
      <Button
        onClick={beginSelect}
        disabled={
