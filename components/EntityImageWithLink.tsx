import { FC } from 'react'
import EntityImage, { EntityImageProps } from './EntityImage'


interface EntityImageWithLinkProps extends EntityImageProps {
  link?: string,
}

const EntityImageWithLink: FC<EntityImageWithLinkProps> = (props) => {
  const { link, title, src } = props

  if (link) {
    return (
      <a href={link} target="_blank" rel="noreferrer">
        <EntityImage
          title={title}
          src={src}
        />
      </a>
    )
  }

  return (
    <EntityImage
      title={title}
      src={src}
    />
  )
}


export default EntityImageWithLink
