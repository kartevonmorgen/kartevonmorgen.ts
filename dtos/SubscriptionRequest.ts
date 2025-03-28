export interface SubscriptionRequest {
  title: string
  email: string
  lat_min: number
  lon_min: number
  lat_max: number
  lon_max: number
  interval: 'daily' | 'weekly' | 'monthly'
  subscription_type: 'creates' | 'updates' | 'tags'
  language: string
}
