"use client"

import { useEffect, useState, useRef } from "react"

type Offering = {
  id: string
  title: string
  ext: string
  createdAt: number
}

const STORAGE_KEY = "offerings-meta-v1"

function splitName(name: string) {
  const lastDot = name.lastIndexOf(".")
  if (lastDot <= 0 || lastDot === name.length - 1) return { title: name, ext: "" }
  return { title: name.slice(0, lastDot), ext: name.slice(lastDot) }
}

function formatLine(o: Offering) {
  const d = new Date(o.createdAt)
  const date = d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  return `${o.title}${o.ext}${" "} - ${date} - ${time}`
}

export function UploadOffering() {
  const [items, setItems] = useState<Offering[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load metadata on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setItems(JSON.parse(raw))
  }, [])

  // Save metadata on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const beginSelect = () => {
    if (uploading) return
    inputRef.current?.click()
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
