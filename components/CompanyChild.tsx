import { FC } from 'react'
import { EntrySlugEntity, SlugAction } from '../utils/types'
import EntryChild from './EntryChild'


interface CompanyChildProps {
  slugAction: SlugAction
}


const CompanyChild: FC<CompanyChildProps> = (props) => {
  const { slugAction } = props

  return <EntryChild slugAction={slugAction}/>
}


export default CompanyChild
