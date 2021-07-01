const DEFAULT_ICON = 'link'

const domainToTagDetailMapper: DomainToTagDetailMapper = {
  'default': {
    type: 'icon',
    color: '',
    name: DEFAULT_ICON,
    solidStyle: 'fas',
  },
  'wa.me': {
    type: 'icon',
    color: '#075e54',
    name: 'whatsapp',
    solidStyle: 'fab',
  },
  'facebook.com': {
    type: 'icon',
    color: '#3b5999',
    name: 'facebook',
    solidStyle: 'fab',
  },
  'fb.me': {
    type: 'icon',
    color: '#3b5999',
    name: 'facebook',
    solidStyle: 'fab',
  },
  'instagram.com': {
    type: 'icon',
    color: '#e95950',
    name: 'instagram',
    solidStyle: 'fab',
  },
  'twitter.com': {
    type: 'icon',
    color: '#55acee',
    name: 'twitter',
    solidStyle: 'fab',
  },
  't.co': {
    type: 'icon',
    color: '#55acee',
    name: 'twitter',
    solidStyle: 'fab',
  },
  't.me': {
    type: 'icon',
    color: '#0088cc',
    name: 'telegram',
    solidStyle: 'fab',
  },
  'youtube.com': {
    type: 'icon',
    color: '#cd201f',
    name: 'youtube',
    solidStyle: 'fab',
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