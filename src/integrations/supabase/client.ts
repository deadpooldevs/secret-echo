// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jswdxeufxzxkyvwtvjrw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd2R4ZXVmeHp4a3l2d3R2anJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTU1NDMsImV4cCI6MjA1NzQ3MTU0M30.gD3ea-NPahJzdEHJHkUwjkBYTcptZtr5L5J8INnZ7K8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);