import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { title } = await req.json();

  const { error } = await supabase
    .from("uploads")
    .insert([{ filename: title }]); // hanya butuh filename, created_at auto

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
