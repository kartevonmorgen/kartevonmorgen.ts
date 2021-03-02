import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { NextRouter, useRouter } from 'next/router'
import toString from 'lodash/toString'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List as VirtualList } from 'react-virtualized'
import { List, Space, Tag } from 'antd'
import { Type as ResultType, types as resultTypes } from './TypeChooser'
import { SearchResults } from '../dtos/SearchResult'
import searchResultSelector from '../selectors/searchResults'
import { RootState } from '../slices'
import { mapTypeIdToPluralEntityName } from '../utils/types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { convertQueryParamToArray, updateRoutingQuery } from '../utils/utils'
import 'react-virtualized/styles.css'


const onResultClick = (id: SearchEntryID | EventID, type: ResultType, router: NextRouter) => () => {
  const pluralTypeName = mapTypeIdToPluralEntityName[type.id]
  const { query } = router
  const { slug } = query
  const slugArray = convertQueryParamToArray(slug)
  const newQueryParams = updateRoutingQuery(
    query,
    {
      slug: [...slugArray, pluralTypeName, id],
    },
  )

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )

}


// todo: create a separate component for showing the result
const rowRenderer = (data: SearchResults, router: NextRouter) => ({ index, key, parent, style }) => {
  const item = data[index]
  const { id, title, tags, categories } = item
  // found some events with undefined description so a default value is mandatory
  let { description } = item
  description = toString(description)
  const type = resultTypes.find(t => t.id === categories[0])

  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure }) => (
        <List.Item
          key={key}
          onLoad={measure}
          style={style}
          onClick={onResultClick(id, type, router)}
        >
          <List.Item.Meta
            title={title}
            description={<Tag color={type.color}>{type.name}</Tag>}
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
        </List.Item>
      )}
    </CellMeasurer>
  )
}

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
  // keyMapper: () => 1
})

const ResultList: FC = () => {
  const searchResults: SearchResults = useSelector(
    (state: RootState) => searchResultSelector(state),
  )

  const router = useRouter()

  return (
    <List
      itemLayout="vertical"
      size="large"
      style={{
        width: '100%',
        height: '100%',
      }}
    >

      <AutoSizer>
        {({ height, width }) => (
          <VirtualList
            deferredMeasurementCache={cache}
            defaultHeight={120}
            defaultWidth={150}
            height={height}
            rowCount={searchResults.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer(searchResults, router)}
            width={width}
          />
        )}
      </AutoSizer>
    </List>
  )
}


export default ResultList