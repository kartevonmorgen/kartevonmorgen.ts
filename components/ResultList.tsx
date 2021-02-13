import React from 'react'
import {AutoSizer, List as VirtualList} from 'react-virtualized'
import {List, Tag, Space} from 'antd'
import 'react-virtualized/styles.css'


const listData = []
for (let i = 0; i < 50; i++) {
  listData.push({
    'id': `7cee99c287094a94acbdcf29ffff2e85${i}`,
    'status': 'created',
    'lat': 50.91339038261836,
    'lng': 6.966415646936007,
    'title': `NeuLand Köln ${i}`,
    'description': 'Der mobile Gemeinschaftsgarten\n\n[Zusätzlich: Fairteiler von foodsharing]',
    'categories': [
      'Initiative'
    ],
    'tags': [
      'gemeinschaftsgarten',
      'markt'
    ],
    'ratings': {
      'total': 1.8333333333333333,
      'diversity': 2.0,
      'fairness': 2.0,
      'humanity': 2.0,
      'renewable': 1.0,
      'solidarity': 2.0,
      'transparency': 2.0
    }
  })
}


function rowRenderer({key, index, style}) {
  const item = listData[index]
  return (
    <List.Item
      key={key}
      style={style}
    >
      <List.Item.Meta
        title={item.title}
        description={<Tag>{item.categories[0]}</Tag>}
      />
      <div>{item.description}</div>
      <div style={{marginTop: 4}}>
        <Space>
          {item.tags.map((tag: string) => <Tag key={tag}>{tag}</Tag>)}
        </Space>
      </div>
    </List.Item>
  )
}


const ResultList = () => {
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
              rowCount={listData.length}
              rowHeight={160}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
    </List>
  )
}


export default ResultList