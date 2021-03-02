import { FC } from 'react'
import NextImage from 'next/image'
import { Image } from 'antd'


interface EntityImageProps {
  src?: string
  title: string
}

const EntityImage: FC<EntityImageProps> = (props) => {
  return (
    <div className="entity-image-container">
      {
        props.src ?
          (
            <Image
              src={props.src}
              alt={props.title}
              width="100%"
              height="32vh"
            />
          ) : (
            <NextImage
              src="/assets/file_image.png"
              alt={props.title}
              width={56}
              height={44}
              layout="fixed"
            />
          )
      }
    </div>
  )
}


export default EntityImage