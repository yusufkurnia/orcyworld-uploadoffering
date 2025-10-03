import { createClient } from "@supabase/supabase-js"

// Ambil dari environment variables (sudah kamu set di Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Buat client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
