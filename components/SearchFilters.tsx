import { FC } from 'react'
import { Collapse } from 'antd'
import TypeChooser from './TypeChooser'
import SearchTags from './SearchTags'
import SearchRegion from './SearchRegion'
import SearchCheckboxGroup from './SearchCheckboxGroup'
import SearchLimitSelect from './SearchLimitSelect'


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

      <TypeChooser/>

      <SearchCheckboxGroup/>

      <SearchTags/>

      <SearchRegion/>

      <SearchLimitSelect/>

    </Panel>
  </Collapse>
)


export default SearchFilters
