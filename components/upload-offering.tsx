"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Offering = {
  id: string
  title: string
  ext: string // includes dot, e.g. ".pdf" or "" if none
  createdAt: number // epoch ms
}

const STORAGE_KEY = "offerings-meta-v1"

function formatLine(o: Offering) {
  const d = new Date(o.createdAt)
  const date = d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  return `${o.title}${o.ext ? o.ext : ""} - ${date} - ${time}`
}

function splitName(name: string): { title: string; ext: string } {
  const lastDot = name.lastIndexOf(".")
  if (lastDot <= 0 || lastDot === name.length - 1) return { title: name, ext: "" }
  return { title: name.slice(0, lastDot), ext: name.slice(lastDot) }
}

export function UploadOffering() {
  const [items, setItems] = useState<Offering[]>([])
  const [displayCount, setDisplayCount] = useState(12)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null) // root scroll container

  // Load/save metadata in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  // Infinite reveal
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

  const ordered = useMemo(() => [...items].sort((a, b) => b.createdAt - a.createdAt), [items])
  const visible = ordered.slice(0, displayCount)

  function beginSelect() {
    if (uploading) return
    inputRef.current?.click()
  }

  function handleFilePicked(file?: File) {
    if (!file) return

    setUploading(true)
    setProgress(0)

    const start = Date.now()
    const t = setInterval(() => {
      setProgress((p) => {
        const elapsed = Date.now() - start
        return Math.min(98, Math.max(p + Math.random() * 12, elapsed / 50))
      })
    }, 250)

    const totalDelay = 800 + Math.random() * 1200
    setTimeout(() => {
      clearInterval(t)
      setProgress(100)
      const { title, ext } = splitName(file.name)
      const newItem: Offering = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        ext,
        createdAt: Date.now(),
      }
      setItems((prev) => [newItem, ...prev])

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ""
      }, 350)
    }, totalDelay)
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFilePicked(e.target.files?.[0] || undefined)}
        aria-label="Pilih berkas untuk diunggah"
      />

      <Button
        onClick={beginSelect}
        disabled={uploading}
        style={{ backgroundColor: "#FFDE00", color: "#000" }}
        className={cn(
          "fixed left-1/2 -translate-x-1/2 top-36 md:top-44 z-10 px-5 py-2.5 rounded-md",
          "shadow-[0_0_0_1px_var(--color-border)]"
        )}
      >
        {uploading ? `Uploading ${Math.floor(progress)}%` : "Upload File"}
      </Button>

      {uploading && (
        <div
          className="fixed left-1/2 -translate-x-1/2 top-48 md:top-56 w-56 h-2 rounded-md bg-black/20 overflow-hidden z-10"
          aria-hidden="true"
        >
          <div
            className="h-full bg-black transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div
        ref={listRef}
        className="fixed inset-x-0 top-48 md:top-56 bottom-10 md:bottom-14 overflow-y-auto mx-auto max-w-md px-4 ritual-list"
      >
        {visible.length === 0 ? (
          <p className="text-center mt-8 text-gray-500">No files uploaded yet</p>
        ) : (
          <>
            {visible.map((o) => (
              <div key={o.id} className="leading-relaxed">
                {formatLine(o)}
              </div>
            ))}
            <div ref={sentinelRef} className="h-8" />
          </>
        )}
      </div>
    </div>
  )
}
