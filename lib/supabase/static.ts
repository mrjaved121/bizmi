import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Plain anon-key client with no cookie handling — for build-time contexts
// like `generateStaticParams` / `generateMetadata`, where no request (and
// therefore no `cookies()`) exists yet. Only ever queries public data.
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
