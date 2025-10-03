"use client";

import { useEffect, useRef, useState } from "react";

type Offering = {
  id: string;
  title: string;
  ext: string;
  createdAt: number;
};

const STORAGE_KEY = "offerings-meta-v1";

function formatLine(o: Offering) {
  const d = new Date(o.createdAt);
  return `${o.title}${o.ext || ""} - ${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`;
}

function splitName(name: string): { title: string; ext: string } {
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) return { title: name, ext: "" };
  return { title: name.slice(0, lastDot), ext: name.slice(lastDot) };
}

export function UploadOffering() {
  const [items, setItems] = useState<Offering[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  function beginSelect() {
    inputRef.current?.click();
  }

  function handleFilePicked(file?: File) {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const start = Date.now();
    const interval = setInterval(() => {
      setProgress((p) => {
        const elapsed = Date.now() - start;
        return Math.min(98, Math.max(p + Math.random() * 12, elapsed / 50));
      });
    }, 200);

    const totalDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      const { title, ext } = splitName(file.name);
      const newItem: Offering = { id: `${Date.now()}`, title, ext, createdAt: Date.now() };
      setItems((prev) => [newItem, ...prev]);

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        if (inputRef.current) inputRef.current.value = "";
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }, totalDelay);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFilePicked(e.target.files?.[0])}
        aria-hidden
      />

      {/* Fixed button: berikan top eksplisit sehingga selalu di bawah logo */}
      <div
        className="
          fixed left-1/2 -translate-x-1/2 z-40
          top-[8.5rem] md:top-[9.5rem] lg:top-[10.5rem]
        "
      >
        <button
          onClick={beginSelect}
          disabled={uploading}
          className="px-6 py-3 rounded-md font-semibold transition border-2 border-black shadow-lg bg-[#FFDE00] text-black hover:shadow-xl disabled:opacity-60"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {uploading ? `Uploading ${Math.floor(progress)}%` : "Upload Offering"}
        </button>

        {/* Progress bar under button */}
        {uploading && (
          <div className="w-56 h-2 rounded-md bg-black/10 overflow-hidden mt-3 mx-auto">
            <div
              className="h-full bg-[#FFDE00] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Scrollable list area:
          posisi fixed dari `top` (di bawah tombol) sampai bottom:0,
          sehingga hanya area ini yang bisa discroll.
          top values harus lebih besar dari button top + button height.
      */}
      <div
        ref={listRef}
        className="
          fixed left-0 right-0 bottom-0
          top-[12.5rem] md:top-[13.5rem] lg:top-[14.5rem]
          overflow-y-auto flex justify-center
        "
      >
        <div className="w-full max-w-md px-4 pt-4 pb-8">
          {items.length === 0 ? (
            <p className="text-[#FFDE00] text-center">No files uploaded yet</p>
          ) : (
            items
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((o) => (
                <div
                  key={o.id}
                  className="leading-relaxed w-full text-center text-sm text-[#FFDE00] py-2"
                >
                  {formatLine(o)}
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}

export default UploadOffering;
