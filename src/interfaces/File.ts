export interface File {
  id: string
  user_id: string
  file_name: string
  key: string
  transcript?: string
  is_ready: boolean
  error?: string
  created_at: string
  transcript_key?: string
}
