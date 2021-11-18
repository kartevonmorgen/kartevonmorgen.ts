import { FC } from 'react'
import Image from 'next/image'

type CardPropsType = {
  name: string
  img: string
  product: string
  place: string
  description: string
}
export const Card: FC<CardPropsType> = (props) => {
  const { img, product, place, name, description } = props
  return (
    <div className='card'>
      <div className='card__amb'>
        <Image className='img' src={img} alt='photoAmb' width={350} height={450} layout="responsive"/>
      </div>
      <div className='card__about-block about'>
        <h2 className='co_map_title about__title'>{name}</h2>
        <p className='co_map_subtitle about__subtitle'>{product}</p>
        <p className='about__place'>{place}</p>
        <p className='about__about-position'>{description}</p>
      </div>
    </div>
  )
}