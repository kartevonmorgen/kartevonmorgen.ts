import { FC, useEffect, useState } from 'react'
import { Carousel } from 'antd'
import { AxiosInstance } from '../../../api'
import { Card } from './Сard'

type CardType = {
  name: string
  img: string
  product: string
  place: string
  description: string
}


const Slider: FC<{ API_URL: string }> = (props: { API_URL: string }) => {

  const API_URL = props.API_URL

  const [card, setCard] = useState([] as CardType[])

  useEffect(() => {
      AxiosInstance.GetRequest(API_URL).then((res) => {
          // @ts-ignore
          setCard(res.data);
      });
  }, []);

  return (
    <div className='carousel'>
      <Carousel dots={{ className: 'dots' }} autoplay>
        {
          card.map((m, i) => <Card
            key={i}
            name={m.name}
            img={m.img}
            product={m.product}
            place={m.place}
            description={m.description}
          />)
        }
      </Carousel>
    </div>
  )
}

export default Slider

