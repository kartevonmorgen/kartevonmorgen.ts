import React from 'react'
import {AutoSizer, List} from 'react-virtualized'

import 'react-virtualized/styles.css'


const list = []
for (let i = 0; i != 100; i++) {
  list.push(`Navid ${i}`)
}

function rowRenderer({key, index, style}) {
  return (
    <div key={key} style={style}>
      {list[index]}
    </div>
  )
}


const ResultList = () => (
  <AutoSizer>
    {({height, width}) => (
      <List
        height={height}
        rowCount={list.length}
        rowHeight={20}
        rowRenderer={rowRenderer}
        width={width}
      />
    )}
  </AutoSizer>
)

export default ResultList
