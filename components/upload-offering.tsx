"use client";

import { useEffect, useState } from "react";

type FileItem = {
  id: string;
  filename: string;
  created_at: string;
};

const STORAGE_KEY = "uploaded-files";

export default function UploadOffering() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setFiles(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

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
    }, 500);
  };

  const formatLine = (f: FileItem) => {
    const d = new Date(f.created_at);
    return `${f.filename} - ${d.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 mt-40 w-full max-w-md px-4">
      <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        {loading ? "Uploading..." : "Upload File"}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

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
