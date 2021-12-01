import { FC } from 'react'
import { useToggle } from 'ahooks'
import { Button, Col, Row } from 'antd'
import SearchFilters from './SearchFilters'
import SearchInput from './SearchInput'
import FilterOutlined from '@ant-design/icons/lib/icons/FilterOutlined'


const onShowFilters = (toggleShowFilters) => () => (toggleShowFilters())

const SearchControllers: FC = (_props) => {
  const [showFilters, { toggle: toggleShowFilters }] = useToggle('0', '1')

  return (
    <div
      style={{
        flex: '0 1 auto',
        marginBottom: 8,
        marginTop: 8,
      }}
    >
      {/* todo: make the search component a separate component to prevent unnecessary renders*/}
      <Row
        align="middle"
        justify="space-around"
        wrap={false}
      >
        <Col
          md={20}
        >
          <SearchInput/>
        </Col>

        <Col
          md={2}
        >
          <Button
            type="text"
            icon={
              <FilterOutlined/>
            }
            shape="round"
            onClick={onShowFilters(toggleShowFilters)}
            size="small"
          />
        </Col>
      </Row>


      <SearchFilters
        showFilters={showFilters}
      />
    </div>
  )
}

export default SearchControllers
