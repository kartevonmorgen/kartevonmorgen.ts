import { useEffect } from 'react'
import { ORDERED_RESPONSIVE_KEYS, Size, VIEW } from '../consts/view'
import { convertUnknownToInt } from '../utils/utils'
import { useResponsive } from 'ahooks'

export { useResponsive as default } from 'ahooks'


const calculateSidebarSize = (size: Size): Size => {
  const { innerHeight, innerWidth } = window

  const width = convertUnknownToInt(innerWidth * size.width)
  const height = convertUnknownToInt(innerHeight * size.height)

  return {
    width,
    height,
  }
}

export const useSidebar = (): Size => {
  const sidebarSizes = VIEW.sidebar.size

  useEffect(() => {
  }, [])

  const responsive = useResponsive()
  if (!responsive) {
    return sidebarSizes.default
  }

  for (let i = ORDERED_RESPONSIVE_KEYS.length - 1; i !== -1; i--) {
    const responsive_key = ORDERED_RESPONSIVE_KEYS[i]
    if (responsive[responsive_key]) {
      return calculateSidebarSize(sidebarSizes[responsive_key])
    }
  }

  return calculateSidebarSize(sidebarSizes.default)
}
