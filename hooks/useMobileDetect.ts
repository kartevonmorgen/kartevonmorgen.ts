// https://stackoverflow.com/a/61519537/3744479
import { useEffect } from 'react'


export type GetMobileDetect = Record<'isAndroid' |
  'isIos' |
  'isOpera' |
  'isWindows' |
  'isSSR' |
  'isMobile' |
  'isDesktop'
  , () => boolean>

const getMobileDetect = (userAgent: NavigatorID['userAgent']): GetMobileDetect => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i))
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i))
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i))
  const isSSR = () => Boolean(userAgent.match(/SSR/i))
  const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows())
  const isDesktop = () => Boolean(!isMobile() && !isSSR())

  return {
    isAndroid,
    isIos,
    isOpera,
    isWindows,
    isSSR,
    isMobile,
    isDesktop,
  }
}
const useMobileDetect = () => {
  useEffect(() => {
  }, [])
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
  return getMobileDetect(userAgent)
}

export default useMobileDetect