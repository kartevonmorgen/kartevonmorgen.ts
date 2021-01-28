import {List, Tag} from 'antd'


const listData = []
for (let i = 0; i < 23; i++) {
  listData.push({
    'id': '7cee99c287094a94acbdcf29ffff2e85',
    'status': 'created',
    'lat': 50.91339038261836,
    'lng': 6.966415646936007,
    'title': 'NeuLand Köln',
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


const renderItem = item => (
  <List.Item
    key={item.title}
  >
    <List.Item.Meta
      description={item.categories[0]}
      title={<a href={item.href}>{item.title}</a>}
    />
    {item.description.substr(0, 130)}
    <div>{item.tags.map(tag => <Tag>{tag}</Tag>)}</div>
  </List.Item>
)


const ResultList = () => {
  return (
    <List
      itemLayout="vertical"
      pagination={{
        onChange: page => {
          console.log(page)
        },
        pageSize: 3,
      }}
      size="small"
      dataSource={listData}
      renderItem={renderItem}
    />
  )
}


export default ResultList