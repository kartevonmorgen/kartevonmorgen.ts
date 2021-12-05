import React, { FC, Fragment } from 'react'
import Flower from './Flower'
import { Divider } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import SearchEntry, { SearchEntryID } from '../dtos/SearchEntry'
import useEntrySearcher from '../hooks/useEntrySearcher'


interface EntryRatingFlowerProps {
  entryId: SearchEntryID
}

const EntryRatingFlower: FC<EntryRatingFlowerProps> = (props) => {
  const { entryId } = props

  const { t } = useTranslation('map')

  const [searchEntry, error] = useEntrySearcher(entryId)

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

      <Divider>{t('ratings.rating-heading')}</Divider>

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
