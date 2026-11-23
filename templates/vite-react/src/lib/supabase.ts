import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function queryExplicit<T>(
  table: string,
  columns: string
): Promise<{ data: T[] | null; error: Error | null }> {
  if (columns.trim() === "*") {
    throw new Error(
      "Directives violation: Wildcard select('*') is forbidden. Specify explicit column names."
    );
  }

  const { data, error } = await supabase.from(table).select(columns);

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as T[], error: null };
}
