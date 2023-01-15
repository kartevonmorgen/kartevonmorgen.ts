import { IconProp } from '@fortawesome/fontawesome-svg-core'

export enum LinkPolicy {
  self = 'self',
  newTab = 'newTab'
}

export interface LinkWithIcon {
  link: string
  title: string
  icon: IconProp
  policy: LinkPolicy
}

export const LinkPolicyToTargetAttributeMapper = {
  [LinkPolicy.self]: '',
  [LinkPolicy.newTab]: '_blank',
}