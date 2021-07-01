import React, { CSSProperties, FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { List, Space, Tag } from 'antd'
import TypeTag from './TypeTag'
import { SearchResult } from '../dtos/SearchResult'
import { Type as ResultType, types as resultTypes } from './TypeChooser'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { redirectToEntityDetail } from '../utils/slug'
import toString from 'lodash/toString'
import { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer'


const { Item } = List


interface ResultCardProps extends CellMeasurerChildProps {
  searchResult: SearchResult
  style?: CSSProperties
}

const onResultClick = (
  router: NextRouter,
  type: ResultType,
  id: SearchEntryID | EventID,
) => () => {
  redirectToEntityDetail(
    router,
    id,
    type.id,
    0,
    [],
  )
}

const ResultCard: FC<ResultCardProps> = (props) => {

  const { searchResult, style, measure } = props
  const { id, title, tags, categories } = searchResult

  // found some events with undefined description so a default value is mandatory
  let { description } = searchResult
  description = toString(description)

  const type = resultTypes.find(t => t.id === categories[0])

  const router = useRouter()


  // todo: bug maybe here is the place we should touch to have the cells measures correctly
  return (
    <Item
      onLoad={measure}
      style={style}
      onClick={onResultClick(router, type, id)}
    >
      <Item.Meta
        title={title}
        description={
          <TypeTag type={type.name}/>
        }
      />
      <div>{description.substr(0, 70)}</div>
      <div style={{ marginTop: 4 }}>
        <Space size="small" wrap>
          {
            tags.slice(0, 3).map(
              (tag: string) => (<Tag key={tag}>{tag}</Tag>),
            )
          }
        </Space>
      </div>
    </Item>
  )
}

export default ResultCard