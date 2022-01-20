import React, { FC } from 'react'
import Image from 'next/image'
import { Button } from 'antd'
import Link from 'next/link'
import data from '../utils/partners.json'


const Partners: FC = () => {
  return (
    <div className={'partners_main_block'}>
      <div className={'ambassadors_container'}>
        <div className={'ambassadors_container-info'}>
          <div> 
            <img
              src={'/projects/co-map/assets/img/comap.component.white.svg'}
              className={'comap_component_image'}
            />
          </div>
          <div>start@s-ol.ru</div>
        </div>
        <Button>
          <Link href={'/ambassadors'}>
            <p>
              Стать амбассадором
          </p>
          </Link>          
        </Button>
      </div>

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
    </div>
  )
}
export default Partners