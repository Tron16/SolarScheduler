
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://walufjhjgtcrxnhkazxx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbHVmamhqZ3RjcnhuaGthenh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDk5NTksImV4cCI6MjA1NjQyNTk1OX0.jt93KJku1QWM6l948CpgwOlaC2pqOfFrA3kZ6fOz_-A";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
