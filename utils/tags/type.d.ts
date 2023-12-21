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

export const newTagDetail = (): TagDetail => ({
  type: 'icon',
  color: '',
  name: '',
})
