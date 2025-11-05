import { FC, Fragment } from 'react'
import Flower from './Flower'
import { Divider } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import SearchEntry, { SearchEntryID } from '../dtos/SearchEntry'
import useEntrySearcher from '../hooks/useEntrySearcher'
import useRatingsVisibility from '../hooks/useRatingsVisibility'


interface EntryRatingFlowerProps {
  entryId: SearchEntryID
}

const EntryRatingFlower: FC<EntryRatingFlowerProps> = (props) => {
  const { entryId } = props

  const { t } = useTranslation('map')

  const shouldShowRatings = useRatingsVisibility()

  const [searchEntry, error] = useEntrySearcher(entryId)

  // Don't render if ratings should be hidden
  if (!shouldShowRatings) {
    return null
  }

  // todo: catch error
  if (error) {
    return null
  }

  if (!searchEntry) {
    return null
  }

  const { ratings } = (searchEntry as SearchEntry)

  return (
    <Fragment>

      <Divider
        style={{
          fontWeight: 'bold'
        }}
      >
        {t('ratings.rating-heading')}
      </Divider>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <Flower
          showTooltip
          radius={40}
          ratings={ratings}
        />
      </div>
    </Fragment>
  )
}


export default EntryRatingFlower
