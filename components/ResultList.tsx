import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import toString from 'lodash/toString'
import { AutoSizer, List as VirtualList } from 'react-virtualized'
import { List, Space, Tag } from 'antd'

import { SearchEntries } from '../dtos/SearchEntry'
import { types as resultType } from './TypeChooser'
import { RootState } from '../slices'

import 'react-virtualized/styles.css'
import { CompactEvents } from '../dtos/Event'
import { compactEventsSelector } from '../slices/eventsSlice'
import { entriesSelector } from '../slices/entriesSlice'
import { SearchResult } from '../dtos/SearchResult'


const rowRenderer = data => ({ key, index, style }) => {
  const item = data[index]
  const {title, tags, categories} = item
  // found some events with undefined description so a default value is mandatory
  let {description} = item
  description = toString(description)
  const type = resultType.find(t => t.id === categories[0])

  return (
    <List.Item
      key={key}
      style={style}
    >
      <List.Item.Meta
        title={title}
        description={<Tag color={type.color}>{type.name}</Tag>}
      />
      <div>{description.substr(0, 70)}</div>
      <div style={{ marginTop: 4 }}>
        <Space size="small">
          {
            tags.slice(0, 3).map(
              (tag: string) => (<Tag key={tag}>{tag}</Tag>),
            )
          }
        </Space>
      </div>
    </List.Item>
  )
}


const ResultList: FC = () => {
  const searchEntries: SearchEntries = useSelector((state: RootState) => entriesSelector(state))
  const searchEvents: CompactEvents = useSelector((state: RootState) => compactEventsSelector(state))

  const searchResults: SearchResult = [...searchEntries, ...searchEvents]

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
            defaultHeight={120}
            defaultWidth={150}
            height={height}
            rowCount={searchResults.length}
            rowHeight={160}
            rowRenderer={rowRenderer(searchResults)}
            width={width}
          />
        )}
      </AutoSizer>
    </List>
  )
}


export default ResultList