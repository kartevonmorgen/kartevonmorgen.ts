import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'


const EventDetail: FC = () => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)
  const { id: eventId } = slugAction


  useEffect(() => {

  }, [eventId])


  return (
    <p>Entry Detail</p>
  )
}

export default EventDetail