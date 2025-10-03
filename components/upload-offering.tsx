"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FileItem = {
  id: string;
  filename: string;
  created_at: string;
};

export default function UploadOffering() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch awal & realtime
  useEffect(() => {
    fetchFiles();

    const channel = supabase
      .channel("uploads-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "uploads" },
        (payload) => {
          setFiles((prev) => [payload.new as FileItem, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchFiles() {
    const { data } = await supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setFiles(data);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: file.name }),
    });

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center space-y-6 mt-40 w-full max-w-md px-4">
      {/* Tombol Upload */}
      <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        {loading ? "Uploading..." : "Upload File"}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

      {/* List file */}
      <div className="w-full max-h-[60vh] overflow-y-auto space-y-2">
        {files.map((f) => (
          <div
            key={f.id}
            className="p-3 border rounded-lg bg-white shadow-sm"
          >
            <div className="font-medium">{f.filename}</div>
            <div className="text-sm text-gray-500">
              {new Date(f.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
