import { TagArray } from './Tag'
import { Categories } from './Categories'
import { CustomLinkList } from './CustomLink'
import { EntryContact } from './EntryContact'
import { EntryAddress } from './EntryAddress'


export interface Entry extends EntryContact, EntryAddress {
  categories?: Categories
  created?: number
  description: string
  founded_on?: string
  id?: string
  image_link_url?: string
  image_url?: string
  lat: number
  license: string
  links?: CustomLinkList
  lng: number
  opening_hours?: string
  ratings?: string[]
  tags?: TagArray
  title: string
  version?: number
}

export type Entries = Entry[]
