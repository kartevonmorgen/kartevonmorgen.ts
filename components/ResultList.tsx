import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import toString from 'lodash/toString'

import { AutoSizer, CellMeasurer, CellMeasurerCache, List as VirtualList } from 'react-virtualized'
import { List, Space, Tag } from 'antd'

import { types as resultType } from './TypeChooser'

import { SearchResults } from '../dtos/SearchResult'
import searchResultSelector from '../selectors/searchResults'
import { RootState } from '../slices'

import 'react-virtualized/styles.css'


// todo: create a separate component for showing the result
const rowRenderer = data => ({ index, key, parent, style }) => {
  const item = data[index]
  const { title, tags, categories } = item
  // found some events with undefined description so a default value is mandatory
  let { description } = item
  description = toString(description)
  const type = resultType.find(t => t.id === categories[0])

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
            rowRenderer={rowRenderer(searchResults)}
            width={width}
          />
        )}
      </AutoSizer>
    </List>
  )
}


export default ResultList