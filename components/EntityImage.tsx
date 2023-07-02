import { FC } from 'react'


export interface EntityImageProps {
  src?: string
  title: string
}

const EntityImage: FC<EntityImageProps> = (props) => {
  const { src, title } = props

  if (!src) {
    return null
  }

  return (
    <div
      className="entity-image-container"
    >
      <img
        src={src}
        alt={title}
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: 'calc(100% + 24px)',
          maxHeight: 285,
          marginLeft: -12,
          marginRight: -12,
        }}
      />
    </div>
  )
}


export default EntityImage
