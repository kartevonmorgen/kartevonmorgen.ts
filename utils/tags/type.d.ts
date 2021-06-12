type TagIconType = 'icon' | 'image'

interface TagDetail {
  type: TagIconType
  name: string
  color: string
}

interface DomainToTagDetailMapper {
  [domain: string]: TagDetail
}