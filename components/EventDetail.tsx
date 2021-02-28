import { FC } from 'react'
import { useRouter } from 'next/router'
import { useBoolean } from 'ahooks'
import { getSlugActionFromQuery } from '../utils/slug'


const EventDetail: FC = () => {
  const router = useRouter()
  const { query } = router

  const [
    isLoading,
    {
      toggle: toggleLoading,
      setTrue: startLoading,
      setFalse: stopLoading,
    },
  ] = useBoolean()

  const slugAction = getSlugActionFromQuery(query)
  const { id: eventId } = slugAction


  return null
}

export default EventDetail