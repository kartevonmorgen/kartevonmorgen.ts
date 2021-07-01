import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { NextRouter, useRouter } from 'next/router'
import toString from 'lodash/toString'
import { List, Space, Tag } from 'antd'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List as VirtualList } from 'react-virtualized'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import { SearchResults } from '../dtos/SearchResult'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { Type as ResultType, types as resultTypes } from './TypeChooser'
import { redirectToEntityDetail } from '../utils/slug'
import 'react-virtualized/styles.css'
import TypeTag from './TypeTag'


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
          onClick={onResultClick(router, type, id)}
        >
          <List.Item.Meta
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
        </List.Item>
      )}
    </CellMeasurer>
  )
}

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
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
            defaultHeight={70}
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