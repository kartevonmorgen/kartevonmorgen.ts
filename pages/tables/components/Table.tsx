import React, { FC, Fragment } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Table as AntTable, Typography } from 'antd'
import moment from 'moment'
import Event, { Events } from '../../../dtos/Event'


const { Text, Link } = Typography


// todo: the domain embedded in the title should come from env
// note: the name of column is the corresponding key from locales/[locale]/tables.json
const columns = [
  {
    title: 'event',
    key: 'event',
    render: (_, record: Event) => (
      <Fragment key={`column-event-${record.id}`}>
        <Link
          strong
          href={`https://kartevonmorgen.org/#/?entry=${record.id}`}
          target="_blank"
        >
          {record.title}
        </Link>
      </Fragment>
    ),
  },
  {
    title: 'time',
    key: 'time',
    render: (_, record: Event) => {
      const startTime = moment.unix(record.start)
      const endTime = moment.unix(record.end)
      const areStartAndEndInTheSameDay = endTime.isSame(startTime, 'day')

      return (
        <Fragment key={`column-description-${record.id}`}>
          <Text>
            {`${startTime.utc().format('llll')}`}
            {` - `}
            {
              areStartAndEndInTheSameDay ?
                endTime.utc().format('LT') :
                endTime.utc().format('llll')
            }
          </Text>
        </Fragment>
      )
    },
  },
]


interface TableProps {
  dataSource?: Events
}

const Table: FC<TableProps> = (props) => {

  const { t } = useTranslation('tables')

  const { dataSource } = props
  const translatedColumns = columns.map(c => ({ ...c, 'title': t(c.title) }))

  if (!dataSource) {
    return <AntTable bordered loading columns={translatedColumns}/>
  }

  return (
    <AntTable
      bordered
      dataSource={dataSource}
      columns={translatedColumns}
      sticky
      scroll={{
        scrollToFirstRowOnChange: true,
        y: 500,
      }}
    />
  )
}


export default Table