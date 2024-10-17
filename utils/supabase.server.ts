import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "database.types";

export default function createSupabaseServerClient({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) {
  return createServerClient<Database>(
    process.env.VITE_PUBLIC_SUPABASE_URL!,
    process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!,
    { request, response }
  );
}
