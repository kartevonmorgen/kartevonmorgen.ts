import React, { FC, Fragment } from 'react'
import { Table as AntTable, Typography } from 'antd'
import moment from 'moment'
import addressFormatter from '@fragaria/address-formatter'
import { cropText } from '../../../utils/utils'
import Event, { Events } from '../../../dtos/Event'


const { Text, Paragraph, Link } = Typography


// todo: the domain embedded in the title should come from env
const columns = [
  {
    title: 'Event and Description',
    key: 'event',
    render: (_, record: Event) => (
      <Fragment>
        <Link
          strong
          href={`https://kartevonmorgen.org/#/?entry=${record.id}`}
          target="_blank"
        >
          {record.title}
        </Link>

        <Paragraph>
          {cropText(record.description, { sentenceLimit: 1, wordLimit: 50 })}
        </Paragraph>
      </Fragment>
    ),
  },
  {
    title: 'Time and Place',
    key: 'description',
    render: (_, record: Event) => {
      const startTime = moment.unix(record.start)
      const endTime = moment.unix(record.end)
      const areStartAndEndInTheSameDay = endTime.isSame(startTime, 'day')

      return (
        <Fragment>
          <Text>
            {`${startTime.format('llll')}`}
            {` - `}
            {
              areStartAndEndInTheSameDay ? endTime.format('LT') : endTime.format('llll')
            }
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
      )
    },
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