import { FC } from 'react'
import { Collapse, Space } from 'antd'
import SearchTags from './SearchTags'
import SearchRegion from './SearchRegion'
import SearchCheckboxGroup from './SearchCheckboxGroup'
import SearchLimitSelect from './SearchLimitSelect'
import SearchRangePicker from './SearchRangePicker'
import TypeChooser from './TypeChooser'
import { TypeChooserVisibility } from '../utils/router'


const { Panel } = Collapse


export interface FiltersProps {
  showFilters: string
  typeChooserVisibility: TypeChooserVisibility
}

const SearchFilters: FC<FiltersProps> = (props) => {

  const { showFilters, typeChooserVisibility } = props

  return (
    <Collapse
      className="no-pad-collapse"
      expandIcon={(_) => null}
      expandIconPosition="right"
      ghost
      activeKey={showFilters}
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
          {typeChooserVisibility === 'hide' && <TypeChooser/>}

          <SearchCheckboxGroup/>

          <SearchTags/>

          <SearchRegion/>

          <SearchLimitSelect/>

          <SearchRangePicker/>
        </Space>
      </Panel>
    </Collapse>
  )
}

export default SearchFilters
