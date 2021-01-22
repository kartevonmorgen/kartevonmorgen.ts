import useSWR from 'swr'
import axios from 'axios'

import {Table, Tag, Rate, Space} from 'antd'


const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (text) => text.slice(0, 150)
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.slice(0, 5).map(tag => {
          return (
            <Tag color="green" key={tag}>
              {tag}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Rating',
    dataIndex: 'ratings',
    key: 'rating',
    render: ratings => <Space size="small"><Rate allowHalf disabled defaultValue={ratings.total}/></Space>,
  },
];


const fetcher = url => axios.get(url).then(res => res.data.visible.map(entry => ({key: entry.id, ...entry})))

const url = 'https://api.ofdb.io/v0/search?text=&categories=c2dc278a2d6a4b9b8a50cb606fc017ed&bbox=48.552978164400734,6.437988281250001,53.001562274591464,15.391845703125002'

const IFrameTable = () => {
  const { data, error } = useSWR(url, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <Table loading columns={columns}/>

  return <Table dataSource={data} columns={columns} />
}


export default IFrameTable