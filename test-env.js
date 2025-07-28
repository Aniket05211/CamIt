import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // or ".env.local" if you prefer

import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_ANON_KEY:", supabaseAnonKey);

await supabase.from('users').delete().neq('id', '');