import { FC } from 'react'
import { RootSlugEntity, SlugAction } from '../utils/types'
import Entry from './Entry'
import Event from './Event'


interface SidebarContentChildProps {
  slugAction: SlugAction
}


const SidebarContentChild: FC<SidebarContentChildProps> = (props) => {

  const { slugAction } = props

  switch (slugAction.entity) {
    case RootSlugEntity.ENTRY:
      return <Entry slugAction={slugAction}/>
    case RootSlugEntity.EVENT:
      return <Event slugAction={slugAction}/>
    default:
      return null
  }

}


export default SidebarContentChild