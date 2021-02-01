import React from 'react';
import {AutoSizer, List} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

const listData = []
for (let i = 0; i < 1000; i++) {
  listData.push('Brian Vaughn')
  // listData.push({
  //   'id': '7cee99c287094a94acbdcf29ffff2e85',
  //   'status': 'created',
  //   'lat': 50.91339038261836,
  //   'lng': 6.966415646936007,
  //   'title': 'NeuLand Köln',
  //   'description': 'Der mobile Gemeinschaftsgarten\n\n[Zusätzlich: Fairteiler von foodsharing]',
  //   'categories': [
  //     'Initiative'
  //   ],
  //   'tags': [
  //     'gemeinschaftsgarten',
  //     'markt'
  //   ],
  //   'ratings': {
  //     'total': 1.8333333333333333,
  //     'diversity': 2.0,
  //     'fairness': 2.0,
  //     'humanity': 2.0,
  //     'renewable': 1.0,
  //     'solidarity': 2.0,
  //     'transparency': 2.0
  //   }
  // })
}


function rowRenderer({key, index, style}) {
  return (
    <div key={key} style={style}>
      {listData[index]}
    </div>
  );
}


const ResultList = () => {
  return (
    <AutoSizer>
      {({height, width}) => (
        <List
          defaultHeight='30vh'
          defaultWidth={250}
          height={height}
          rowCount={listData.length}
          rowHeight={20}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    </AutoSizer>
  )
}


export default ResultList