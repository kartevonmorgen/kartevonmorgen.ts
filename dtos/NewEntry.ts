import { TagArray } from './Tag'
import { Categories } from './Categories'
import { CustomLinkList } from './CustomLink'
import { EntryContact } from './EntryContact'
import { EntityAddress } from './EntityAddress'


export interface NewEntry extends EntryContact, EntityAddress {
  title: string
  description: string
  lat: number
  lng: number
  opening_hours?: string
  founded_on?: string
  categories?: Categories
  tags?: TagArray
  image_url?: string
  image_link_url?: string
  custom?: CustomLinkList
}