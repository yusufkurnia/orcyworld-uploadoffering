"use client";

import { useState } from "react";

export default function UploadOffering() {
  const [loading, setLoading] = useState(false);

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
    <div className="flex flex-col items-center space-y-4">
      <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
        {loading ? "Uploading..." : "Upload File"}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}
