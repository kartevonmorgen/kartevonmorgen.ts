import { FC } from 'react'
import HomeHeaderCoMap from './HomeHeaderCoMap'
import MapBannerCoMap from './MapBannerCoMap'
import { TeamCoMap } from './TeamCoMap'
import Partners from './Partners'
import HowToUseMap from './HowToUseMap'
import HeaderCardContainer from './HeaderCardContainer'
import ChooseDirectionSearch from './ChooseDirectionSearch'
import { useRouter } from 'next/router'


const Main: FC = () => {
  const router = useRouter()
  const { moveToId } = router.query

  if (process.browser) {
    if (moveToId && typeof moveToId === 'string') {
      let yToScroll = 0
      let element = document.getElementById(moveToId)
      if (element) {
        yToScroll = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top
      }

      window.scrollTo({ top: yToScroll, behavior: 'smooth' })
      router.replace(router.pathname)
    }
  }

  return (
    <>
      <HomeHeaderCoMap/>
      <MapBannerCoMap/>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div className={'bounding_element'}>
          <ChooseDirectionSearch/>
          <HowToUseMap/>
          <TeamCoMap/>
          <Partners/>
        </div>
      </div>
    </>
  )
}


export default Main