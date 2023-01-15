import Registration from './Registration'
import Tag from './Tag'
import Category from './Categories'


export type EventID = string

export interface CompactEvent {
  id: EventID
  title: string
  description: string
  start: number
  end: number
  lat: number
  lng: number
  categories: [Category.EVENT]
  tags: Tag[]
}

interface Event extends CompactEvent {
  created_at: number
  created_by: string
  street: string
  zip: string
  city: string
  country: string
  state: string
  email: string
  telephone: string
  homepage: string
  registration: Registration
  organizer: string
  image_url: string
  image_link_url: string
}

export type CompactEvents = CompactEvent[]

export interface EventsCollection {
  [index: string]: Event
}

export type Events = Event[]


export default Event