import { createClient } from "@supabase/supabase-js";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = { auth: { persistSession: false } };

export function createPublicClient() {
  return createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    options
  );
}

export function createAdminClient() {
  return createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("SUPABASE_SECRET_KEY"),
    options
  );
}
