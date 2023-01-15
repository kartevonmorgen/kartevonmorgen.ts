import { FC, Fragment, ReactElement } from 'react'
import update from 'immer'
import has from 'lodash/has'
import { Divider, Space, Tag, Tooltip } from 'antd'
import { CustomLink, CustomLinkList } from '../dtos/CustomLink'
import { getDomainFromLink } from '../utils/domain'
import domainToTagDetailMapper, { hasTagDetailIcon } from '../utils/tags/domainToTagDetailMapper'
import { titleCase } from 'title-case'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core'
import { getIconDir } from '../utils/tags'


interface EntryLinksProps {
  links: CustomLinkList
}

// has both the custom links attributes and the data needed for visual component
interface EnrichedLinkDetail extends CustomLink, TagDetail {

}

type EnrichedLinkDetails = EnrichedLinkDetail[]


const addTagDetailsToCustomLinks = (links: CustomLinkList): EnrichedLinkDetails => {
  const enrichedLinkDetails = links.map((link) => {
    return update(link, (draft) => {
      const domain = getDomainFromLink(draft.url)
      let tagDetail: TagDetail = domainToTagDetailMapper.default
      if (has(domainToTagDetailMapper, domain)) {
        tagDetail = domainToTagDetailMapper[domain]
      }

      Object.keys(tagDetail).forEach((k) => {
        draft[k] = tagDetail[k]
      })
    })
  })

  return enrichedLinkDetails as EnrichedLinkDetails
}

const enrichedLinkDetailsSortFunc = (l1: EnrichedLinkDetail, l2: EnrichedLinkDetail): number => {
  if (hasTagDetailIcon(l1)) {
    if (!l1.title) {
      return -1
    }

    if (hasTagDetailIcon(l2)) {
      if (!l2.title) {
        return 1
      }

      return l1.title.length - l2.title.length
    }

    return -1
  }

  if (hasTagDetailIcon(l2)) {
    return 1
  }

  if (!l1.title && !l2.title) {
    return l1.url.length - l2.url.length
  }
  if (l1.title && !l2.title) {
    return -1
  }
  if (!l1.title && l2.title) {
    return 1
  }
  if (l1.title && l2.title) {
    return l1.title.length - l2.title.length
  }
}

const getTitle = (enrichedLink: EnrichedLinkDetail): string => {
  const { title, name, url, type, description } = enrichedLink

  if (!title) {
    if (type == 'icon') {
      return titleCase(name)
    }

    if (!!description) {
      return `${description.substring(0, 25)}`
    }

    return `${url.substring(0, 25)}`
  }

  return title
}

const getIcon = (enrichedLink: EnrichedLinkDetail): ReactElement => {
  if (enrichedLink.type === 'image') {
    return (
      <img
        style={{
          width: 15,
          height: 15,
        }}
        alt={enrichedLink.title}
        src={getIconDir(enrichedLink.name)}
      />
    )
  }

  // TODO: upgrade the dependency: https://github.com/FortAwesome/react-fontawesome/issues/366
  return (
    <FontAwesomeIcon
      icon={[enrichedLink.solidStyle as IconPrefix, enrichedLink.name as IconName]}
    />
  )
}


const renderTag = (enrichedLink: EnrichedLinkDetail): ReactElement => (
  <Tag
    icon={getIcon(enrichedLink)}
    color={enrichedLink.color}
  >
    {`     ${getTitle(enrichedLink)}`}
  </Tag>
)


const renderTagWithOptionalTooltip = (enrichedLink: EnrichedLinkDetail): ReactElement => {
  if (!enrichedLink.description) {
    return renderTag(enrichedLink)
  }


  return (
    <Tooltip
      title={enrichedLink.description}
      color="cyan"
    >
      {renderTag(enrichedLink)}
    </Tooltip>
  )
}

const EntryLinks: FC<EntryLinksProps> = (props) => {
  const { links } = props
  if (!links) {
    return null
  }

  const enrichedLinks = addTagDetailsToCustomLinks(links)

  // since enrichedLinks is a copy from immer we are safe to sort in place
  enrichedLinks.sort(enrichedLinkDetailsSortFunc)

  return (
    <Fragment>

      <Divider>Links</Divider>

      <Space
        wrap
        size="middle"
      >
        {
          enrichedLinks.map((enrichedLink, i) => (
            <a
              key={`custom-link-${i}`}
              title={enrichedLink.title}
              href={enrichedLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {renderTagWithOptionalTooltip(enrichedLink)}
            </a>
          ))
        }
      </Space>
    </Fragment>
  )
}


export default EntryLinks
