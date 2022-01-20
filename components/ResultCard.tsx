import { CSSProperties, FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { List, Space, Tag, Typography } from 'antd'
import { SearchResult } from '../dtos/SearchResult'
import { SearchEntryID } from '../dtos/SearchEntry'
import { CompactEvent, EventID } from '../dtos/Event'
import { redirectToEntityDetailAndFlyToLocation } from '../utils/slug'
import toString from 'lodash/toString'
import Category, { CategoryToNameMapper } from '../dtos/Categories'
import { formatDuration } from '../utils/time'
import moment from 'moment'
import { viewActions } from '../slices'


const { Item } = List
const { Text } = Typography


interface ResultCardProps {
  searchResult: SearchResult
  style?: CSSProperties
}

const onResultClick = (
  router: NextRouter,
  type: Category,
  id: SearchEntryID | EventID,
) => () => {
  redirectToEntityDetailAndFlyToLocation(
    router,
    id,
    type,
    0,
    [],
  )
}

const getTimeDescriptionForEvent = (entity: SearchResult, type: Category): string | null => {
  if (type !== Category.EVENT) {
    return null
  }

  const event = entity as CompactEvent

  const start = moment.unix(event.start)
  const end = moment.unix(event.end)

  return formatDuration({ start, end })
}

const getSubstringOfDescription = (description: string, maxLength: number) => {
  if (description.length <= maxLength) {
    return description
  }

  return `${description.substr(0, 70)} ...`
}

const ResultCard: FC<ResultCardProps> = (props) => {
  const { searchResult } = props
  const { id, title, tags, categories } = searchResult

  const dispatch = useDispatch()

  // found some events with undefined description so a default value is mandatory
  let { description } = searchResult
  description = toString(description)

  const type: Category = categories[0]
  const typeName: string = CategoryToNameMapper[type]

  const router = useRouter()


  // todo: bug maybe here is the place we should touch to have the cells measures correctly
  return (
    <Item
      className={`${typeName}-result-card result-card`}
      onClick={onResultClick(router, type, id)}
      onMouseEnter={() => {
        dispatch(viewActions.setHighlight(id))
      }}
      onMouseLeave={() => {
        dispatch(viewActions.unsetHighlight())
      }}
      onFocus={() => {
        dispatch(viewActions.setHighlight(id))
      }}
      onBlur={() => {
        dispatch(viewActions.unsetHighlight())
      }}
    >
      <Item.Meta
        title={<Text strong style={{ fontSize: '1.2rem' }}>{title}</Text>}
        description={getTimeDescriptionForEvent(searchResult, type)}
      />
      <div>{getSubstringOfDescription(description, 70)}</div>
      <div style={{ marginTop: 4 }}>
        <Space
          size={3}
          wrap
        >
          {
            tags.slice(0, 3).map(
              (tag: string) => (
                <Tag
                  key={tag}
                  className="kvm-tag"
                >
                  {`#${tag}`}
                </Tag>
              ),
            )
          }
        </Space>
      </div>
    </Item>
  )
}

export default ResultCard
