"use client"

import { useEffect } from "react"

export default function HideV0Badge() {
  useEffect(() => {
    const hide = () => {
      const selectors = [
        "[data-v0-badge]",
        "[data-v0-overlay]",
        'a[aria-label*="Built with"]',
        'div[aria-label*="Built with"]',
        'a[href*="v0.app"]',
        '[class*="v0"][class*="badge"]',
      ]
      selectors.forEach((sel) => {
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          el.style.setProperty("display", "none", "important")
          el.setAttribute("aria-hidden", "true")
        })
      })

      // Fallback: hide any element whose text includes "Built with" and "v0"
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
      const toHide: HTMLElement[] = []
      while (walker.nextNode()) {
        const el = walker.currentNode as HTMLElement
        const text = (el.textContent || "").trim().toLowerCase()
        if (text.includes("built with") && text.includes("v0")) {
          toHide.push(el)
        }
      }
      toHide.forEach((el) => {
        el.style.setProperty("display", "none", "important")
        el.setAttribute("aria-hidden", "true")
      })
    }

    hide()
    const obs = new MutationObserver(hide)
    obs.observe(document.documentElement, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [])

  return null
}
