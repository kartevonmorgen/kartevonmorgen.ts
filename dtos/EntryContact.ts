export enum EntryContactKeys {
  CONTACT_NAME = 'contact_name',
  TELEPHONE = 'telephone',
  EMAIL = 'email',
  HOMEPAGE = 'homepage',
}

export interface EntryContact {
  [EntryContactKeys.CONTACT_NAME]?: string
  [EntryContactKeys.TELEPHONE]?: string
  [EntryContactKeys.EMAIL]?: string
  [EntryContactKeys.HOMEPAGE]?: string
}