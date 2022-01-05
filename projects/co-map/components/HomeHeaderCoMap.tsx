import Image from 'next/image'
import { Layout, Menu } from 'antd'
import Link from 'next/link'

const HomeHeader = () => {
  const { Header } = Layout
  return (
      <Header className={'header'}>
          <div className={'header-logo'}>
              <Link href={'/'}>
                  <div>
                      <Image
                          src="/projects/co-map/assets/img/comap.component.green.svg"
                          alt="logo"
                          layout="intrinsic"
                          width={170}
                          height={60}
                      />
                  </div>
              </Link>
          </div>
          <Menu style={{alignSelf: 'right', justifyContent: 'flex-end'}} mode="horizontal">
              <Menu.Item key={'co-map'}>
                  <Link href={'/m/co-map'}>Карта</Link>
              </Menu.Item>
              <Menu.Item key={'ambassadors'}>
                  <Link href={'/ambassadors'}>Амбассадорам</Link>
              </Menu.Item>
              <Menu.Item>
                  <Link href={'/mappinginstructions'}>Инструкции</Link>
              </Menu.Item>
          </Menu>
      </Header>
  );
}

export default HomeHeader
