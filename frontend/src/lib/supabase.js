/**
 * Supabase client — Agent Souq
 * Project: hpjbkxknzblmqsvmlykk
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hpjbkxknzblmqsvmlykk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamJreGtuemJsbXFzdm1seWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTk2NDYsImV4cCI6MjA5OTE5NTY0Nn0.L2rIpiu-FijHN0spW0OI-CySbrxHgHKyxYSgs_TwBfc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/** Sign up with email/password */
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })
  return { data, error }
}

/** Sign in with email/password */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

/** Sign out */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/** Get current session */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/** Get current user */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/** Reset password */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://myagentstore.pro/auth?mode=reset'
  })
  return { data, error }
}

/** Get user profile */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

/** Get user orders */
export async function getUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  return { data, error }
}
