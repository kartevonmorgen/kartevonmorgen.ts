import { FC } from 'react'
import Image from 'next/image'
import { Button } from 'antd'
import Link from 'next/link'
import data from '../utils/partners.json'


const Partners: FC = () => {
  return (
    <div className={'partners_main_block'}>
      <h1 className={'co_map_title'}>
        Партнёры
      </h1>
      <div className={'partners_container'}>
        {data.map(p => {
          return <div>
            <Link href={p.siteURL}>
              <a target='_blank'>
                <Image
                  width={p.w}
                  height={p.h}
                  src={p.imageURL}
                  alt={p.alt}
                />
              </a>
            </Link>
          </div>
        })}
      </div>
      <Button>
        <a target={'_blank'}
           href={'/projects/co-map/co-map.ru%20для%20профессионалов.pdf'}>
          <p>
            Стать партнёром
          </p>
        </a>
      </Button>
    </div>
  )
}
export default Partners