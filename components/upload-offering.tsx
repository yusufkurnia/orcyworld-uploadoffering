"use client";

import { useEffect, useState } from "react";

type FileItem = {
  id: string;
  filename: string;
  created_at: string;
};

const STORAGE_KEY = "uploaded-files";

export function UploadOffering() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load awal dari localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setFiles(JSON.parse(raw));
  }, []);

  // Simpan ke localStorage saat files berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  // Upload file
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    setTimeout(() => {
      const newFile: FileItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        filename: file.name,
        created_at: new Date().toISOString(),
      };
      setFiles((prev) => [newFile, ...prev]);
      setLoading(false);
      if (e.target) e.target.value = "";
    }, 500); // simulasi delay upload
  };

  // Tombol refresh manual
  const handleRefresh = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setFiles(JSON.parse(raw));
  };

  // Format file display
  const formatLine = (f: FileItem) => {
    const d = new Date(f.created_at);
    const date = d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${f.filename} - ${date} - ${time}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 mt-40 w-full max-w-md px-4">
      {/* Tombol Upload */}
      <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        {loading ? "Uploading..." : "Upload File"}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

      {/* Tombol Refresh */}
      <button
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        onClick={handleRefresh}
      >
        Refresh List
      </button>

      {/* List file */}
      <div className="w-full max-h-[60vh] overflow-y-auto space-y-2">
        {files.map((f) => (
          <div key={f.id} className="p-3 border rounded-lg bg-white shadow-sm">
            {formatLine(f)}
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No files uploaded yet</div>
        )}
      </div>
    </div>
  );
}
