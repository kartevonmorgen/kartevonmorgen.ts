export interface SubscriptionRequest {
  title: string
  bbox: {
    lat1: number
    lng1: number
    lat2: number
    lng2: number
  }
  email: string
  tags: string[]
  frequency: 'hour' | 'day' | 'week' 
  changeType: 'new' | 'all'
  lang: string
}
