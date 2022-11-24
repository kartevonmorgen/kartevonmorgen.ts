import { FC } from 'react'
import { Collapse, Space } from 'antd'
import SearchTags from './SearchTags'
import SearchRegion from './SearchRegion'
import SearchCheckboxGroup from './SearchCheckboxGroup'
import SearchLimitSelect from './SearchLimitSelect'
import SearchRangePicker from './SearchRangePicker'


const { Panel } = Collapse


export interface FiltersProps {
  showFilters: string
}

const SearchFilters: FC<FiltersProps> = (props) => (
  <Collapse
    className="no-pad-collapse"
    expandIcon={(_) => null}
    expandIconPosition="right"
    ghost
    activeKey={props.showFilters}
    style={{
      paddingLeft: 4,
      paddingRight: 4,
    }}
  >
    <Panel
      header={null}
      key="1"
    >
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <SearchCheckboxGroup/>

        <SearchTags/>

        <SearchRegion/>

        <SearchLimitSelect/>

        <SearchRangePicker/>
      </Space>
    </Panel>
  </Collapse>
)


export default SearchFilters
