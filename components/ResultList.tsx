import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { List } from 'antd'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List as VirtualList } from 'react-virtualized'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import { SearchResults } from '../dtos/SearchResult'
import 'react-virtualized/styles.css'
import ResultCard from './ResultCard'


const rowRenderer = (data: SearchResults) => ({ index, key, parent, style }) => {
  
  const item = data[index]

  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure }) => (
        <ResultCard
          searchResult={item}
          measure={measure}
          style={style}
        />
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
            rowRenderer={rowRenderer(searchResults)}
            width={width}
          />
        )}
      </AutoSizer>
    </List>
  )
}


export default ResultList