export interface Message {
  id: number
  text: string
  time: Date
  sender: string
  loading?: boolean
}
