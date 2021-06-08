import { FC, Fragment } from 'react'
import { useToggle } from 'ahooks'
import { Button, Col, Row } from 'antd'
import SearchFilters from './SearchFilters'
import SearchInput from './SearchInput'
import { FilterOutlined } from '@ant-design/icons/lib'
import { TagsCount } from '../dtos/TagCount'


export interface SearchControllersProps {
  tagsCount: TagsCount
}

const onShowFilters = (toggleShowFilters) => () => (toggleShowFilters())

const SearchControllers: FC<SearchControllersProps> = (props) => {
  const [showFilters, { toggle: toggleShowFilters }] = useToggle('0', '1')

  return (
    <Fragment>
      {/*todo: make the search component a separate component to prevent unnecessary renders*/}
      <Row
        align="middle"
        justify="space-around"
        wrap={false}
        gutter={2}
      >
        <Col
          md={21}
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
        tagsCount={props.tagsCount}
      />
    </Fragment>
  )
}

export default SearchControllers