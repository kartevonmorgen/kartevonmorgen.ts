import { FC, ReactNode } from 'react'
import { RootSlugEntity, SlugAction } from '../utils/types'
import Entry from './Entry'
import Event from './Event'


interface SidebarContentChildProps {
  slugAction: SlugAction
}


const renderSideBarContentChild = (slugAction: SlugAction): ReactNode => {
  switch (slugAction.entity) {
    case RootSlugEntity.ENTRY:
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
