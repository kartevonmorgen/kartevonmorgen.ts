const DEFAULT_ICON = 'link'

const domainToTagDetailMapper: DomainToTagDetailMapper = {
  'default': {
    type: 'icon',
    color: '',
    name: 'DEFAULT_ICON',
  },
  'wa.me': {
    type: 'icon',
    color: '#075e54',
    name: 'whatsapp',
  },
  'facebook.com': {
    type: 'icon',
    color: '#3b5999',
    name: 'facebook',
  },
  'fb.me': {
    type: 'icon',
    color: '#3b5999',
    name: 'facebook',
  },
  'instagram.com': {
    type: 'icon',
    color: '#e95950',
    name: 'instagram',
  },
  'twitter.com': {
    type: 'icon',
    color: '#55acee',
    name: 'twitter',
  },
  't.co': {
    type: 'icon',
    color: '#55acee',
    name: 'twitter',
  },
  't.me': {
    type: 'icon',
    color: '#0088cc',
    name: 'telegram',
  },
  'youtube.com': {
    type: 'icon',
    color: '#cd201f',
    name: 'youtube',
  },
  'werkzeugkasten-wandel.de': {
    type: 'image',
    color: '',
    name: 'renn',
  },
  'nachhaltiger-warenkorb.de': {
    type: 'image',
    color: '',
    name: 'renn',
  },
}


export const hasTagDetailIcon = (tagDetail: TagDetail): boolean => {
  return tagDetail.name !== DEFAULT_ICON
}

export default domainToTagDetailMapper