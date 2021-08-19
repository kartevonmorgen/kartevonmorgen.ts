import { FC } from 'react'
import { Image } from 'antd'


interface EntityImageProps {
  src?: string
  title: string
}

const EntityImage: FC<EntityImageProps> = (props) => {

  const { src, title } = props

  if (!src) {
    return null
  }

  return (
    <div className="entity-image-container">
      <Image
        src={src}
        alt={title}
        width="100%"
        height="32vh"
      />
    </div>
  )
}


export default EntityImage