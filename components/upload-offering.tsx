"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

type Offering = {
  id: string
  filename: string
  created_at: string
}

function formatLine(o: Offering) {
  const d = new Date(o.created_at)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${o.filename} – ${yyyy}-${mm}-${dd} – ${hh}:${min}`
}

export function UploadOffering() {
  const [items, setItems] = useState<Offering[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)

  // fetch awal + subscribe realtime
  useEffect(() => {
    supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as Offering[])
      })

    const channel = supabase
      .channel("realtime:uploads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "uploads" },
        (payload) => {
          setItems((prev) => [payload.new as Offering, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleFilePicked(file?: File) {
    if (!file) return
    setUploading(true)
    setProgress(0)

    // simulasi progress bar
    const start = Date.now()
    const t = setInterval(() => {
      setProgress((p) => Math.min(95, p + Math.random() * 10))
    }, 200)

    setTimeout(async () => {
      clearInterval(t)
      setProgress(100)

      // simpan ke supabase
      const { error } = await supabase.from("uploads").insert({ filename: file.name })
      if (error) console.error(error)

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ""
      }, 400)
    }, 1500)
  }

  function beginSelect() {
    if (uploading) return
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFilePicked(e.target.files?.[0] || undefined)}
      />

      <Button
        onClick={beginSelect}
        disabled={uploading}
        className={cn(
          "fixed left-1/2 -translate-x-1/2 top-48 md:top-64 z-10",
          "bg-primary text-primary-foreground hover:opacity-95 px-5 py-2.5 rounded-md"
        )}
      >
        {uploading ? `Uploading ${Math.floor(progress)}%` : "Upload Offering"}
      </Button>

      {uploading && (
        <div className="fixed left-1/2 -translate-x-1/2 top-60 md:top-72 w-56 h-2 rounded-md bg-secondary/30 overflow-hidden z-10">
          <div className="h-full bg-primary transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="fixed inset-x-0 top-72 md:top-80 bottom-10 md:bottom-14 overflow-y-auto mx-auto max-w-md px-4 ritual-list">
        {items.length === 0 ? (
          <p className="text-center mt-8 text-accent">No offerings uploaded yet</p>
        ) : (
          items.map((o) => (
            <div key={o.id} className="leading-relaxed">
              {formatLine(o)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
