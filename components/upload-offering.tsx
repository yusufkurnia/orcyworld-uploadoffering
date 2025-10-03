"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

type Offering = {
  id: string
  title: string
  ext: string
  createdAt: number
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
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
        return Math.min(98, Math.max(p + Math.random() * 12, elapsed / 50))
      })
    }, 200)

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
      setItems((arr) => [newItem, ...arr])

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ""
        // Scroll to top of list after new file added
        listRef.current?.scrollTo({ top: 0 })
      }, 350)
    }, totalDelay)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFilePicked(e.target.files?.[0] || undefined)}
        aria-label="Pilih berkas untuk diunggah"
      />

      {/* Upload button */}
      <button
        onClick={beginSelect}
        disabled={uploading}
        className={cn(
          "fixed top-[calc(5rem+10px)] left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-md shadow-md font-medium",
          "bg-[#FFDE00] text-black hover:opacity-95 transition"
        )}
      >
        {uploading ? `Uploading ${Math.floor(progress)}%` : "Upload File"}
      </button>

      {/* Progress bar */}
      {uploading && (
        <div className="fixed top-[calc(5rem+56px)] left-1/2 -translate-x-1/2 w-56 h-2 rounded-md bg-black/20 overflow-hidden z-10">
          <div
            className="h-full bg-[#FFDE00] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Scrollable list */}
      <div
        ref={listRef}
        className="fixed top-[calc(5rem+72px)] bottom-10 inset-x-0 mx-auto max-w-md px-4 overflow-y-auto flex flex-col items-center ritual-list"
      >
        {items.length === 0 ? (
          <p className="text-[#FFDE00] mt-4">No files uploaded yet</p>
        ) : (
          items
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((o) => (
              <div key={o.id} className="leading-relaxed w-full text-center">
                {formatLine(o)}
              </div>
            ))
        )}
      </div>
    </>
  )
}
