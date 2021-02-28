import { TagArray } from './Tag'
import { Categories } from './Categories'
import { CustomLinkList } from './CustomLink'

export interface Entry {
  categories?: Categories
  city?: string
  contact_name?: string
  country?: string
  created?: number
  description: string
  email?: string
  founded_on?: string
  homepage?: string
  id?: string
  image_link_url?: string
  image_url?: string
  lat: number
  license: string
  links?: CustomLinkList
  lng: number
  opening_hours?: string
  ratings?: string[]
  state?: string
  street?: string
  tags?: TagArray
  telephone?: string
  title: string
  version?: number
  zip?: string
}

export type Entries = Entry[]
