import { FC } from 'react'
import Image from 'next/image'
import { Divider } from 'antd'


const HomeDivider: FC = () => (
  <Divider
    orientation="center"
  >
    <Image
      src="/assets/img/pincloud.webp"
      layout="fixed"
      width={85}
      height={58}
    />
  </Divider>
)


export default HomeDivider
