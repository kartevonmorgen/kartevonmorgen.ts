import React, { FC, Fragment } from 'react'
import { Table as AntTable, Typography } from 'antd'
import moment from 'moment'
import addressFormatter from '@fragaria/address-formatter'
import { cropText } from '../../../utils/utils'
import Event, { Events } from '../../../dtos/Event'


const { Text, Paragraph } = Typography


const columns = [
  {
    title: 'Event',
    key: 'event',
    render: (_, record: Event) => (
      <Fragment>
        <Text strong>{record.title}</Text>
        <Paragraph>
          {cropText(record.description, { sentenceLimit: 1, wordLimit: 50 })}
        </Paragraph>
      </Fragment>
    ),
  },
  {
    title: 'Description',
    key: 'description',
    render: (_, record: Event) => (
      <Fragment>
        <Text>
          {`${moment.unix(record.start).format('llll')}`} - {`${moment.unix(record.end).format('llll')}`}
        </Text>

        <br/>
        <br/>

        <Paragraph>
          {
            addressFormatter.format({
              street: record.street,
              zip: record.zip,
              city: record.city,
              state: record.state,
              country: record.country,
            })
          }
        </Paragraph>
      </Fragment>
    ),
  },
]


interface TableProps {
  dataSource?: Events
}

const Table: FC<TableProps> = (props) => {

  const { dataSource } = props

  if (!dataSource) {
    return <AntTable bordered loading columns={columns}/>
  }

  return <AntTable bordered dataSource={dataSource} columns={columns}/>
}


export default Table