import { FC, ReactNode } from 'react'
import { RootSlugEntity, SlugAction } from '../utils/types'
import Event from './Event'
import Company from './Company'
import Entry from './Entry'


interface SidebarContentChildProps {
  slugAction: SlugAction
}


const renderSideBarContentChild = (slugAction: SlugAction): ReactNode => {
  // it extended the component tree for company,
  // but in the meanwhile Helmut told me the data model is going to change soon
  switch (slugAction.entity) {
    case RootSlugEntity.ENTRY:
      return <Entry slugAction={slugAction}/>
    case RootSlugEntity.COMPANY:
      return <Company slugAction={slugAction}/>
    case RootSlugEntity.INITIATIVE:
      return <Entry slugAction={slugAction}/>
    case RootSlugEntity.EVENT:
      return <Event slugAction={slugAction}/>
    default:
      return null
  }
}


const SidebarContentChild: FC<SidebarContentChildProps> = (props) => {
  const { slugAction } = props

  return (
    <div
      style={{
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      {renderSideBarContentChild(slugAction)}
    </div>
  )
}


export default SidebarContentChild
