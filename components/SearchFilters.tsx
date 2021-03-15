import { FC } from 'react'
import { Collapse } from 'antd'
import TypeChooser from './TypeChooser'
import SearchTags from './SearchTags'
import { TagsCount } from '../dtos/TagCount'

const { Panel } = Collapse


export interface FiltersProps {
  tagsCount: TagsCount
  showFilters: string
}

const SearchFilters: FC<FiltersProps> = (props) => (
  <Collapse
    className="no-pad-collapse"
    expandIcon={(_) => null}
    expandIconPosition="right"
    ghost
    activeKey={props.showFilters}
  >
    <Panel
      header={null}
      key="1"
    >
      <TypeChooser/>

      <SearchTags
        optionsCount={props.tagsCount}
      />
    </Panel>
  </Collapse>
)


export default SearchFilters