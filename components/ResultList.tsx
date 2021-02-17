import React, {FC} from 'react'
import {useSelector} from 'react-redux'
import {AutoSizer, List as VirtualList} from 'react-virtualized'
import {List, Tag, Space} from 'antd'

import { SearchEntries } from '../dtos/SearchEntry'
import { RootState } from '../slices'

import 'react-virtualized/styles.css'


const rowRenderer = data => ({key, index, style}) => {
  const item = data[index]

  return (
    <List.Item
      key={key}
      style={style}
    >
      <List.Item.Meta
        title={item.title}
        description={<Tag>{item.categories[0]}</Tag>}
      />
      <div>{item.description.substr(0, 70)}</div>
      <div style={{marginTop: 4}}>
        <Space size="small">
          {
            item.tags.slice(0, 3).map(
              (tag: string) => (<Tag key={tag}>{tag}</Tag>)
            )
          }
        </Space>
      </div>
    </List.Item>
  )
}


const ResultList: FC = () => {
  const searchEntries: SearchEntries = useSelector((state: RootState) => state.entries)

  return (
    <List
      itemLayout="vertical"
      size="large"
      style={{
        width: '100%',
        height: '100%'
      }}
    >

        <AutoSizer>
          {({height, width}) => (
            <VirtualList
              defaultHeight={120}
              defaultWidth={150}
              height={height}
              rowCount={searchEntries.length}
              rowHeight={160}
              rowRenderer={rowRenderer(searchEntries)}
              width={width}
            />
          )}
        </AutoSizer>
    </List>
  )
}


export default ResultList