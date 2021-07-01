type TagIconType = 'icon' | 'image'

interface TagDetail {
  type: TagIconType
  color: string
  name: string
  solidStyle?: string
}

interface DomainToTagDetailMapper {
  [domain: string]: TagDetail
}