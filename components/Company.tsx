import { FC } from 'react'
import { SlugAction, SlugVerb } from '../utils/types'
import EntityChooserForm from './EntityChooserForm'
import Category from '../dtos/Categories'
import CompanyDetail from './CompanyDetail'
import CompanyChild from './CompanyChild'


interface CompanyProps {
  slugAction: SlugAction
}


const Company: FC<CompanyProps> = (props) => {
  const { slugAction } = props
  const { subSlugAction } = slugAction

  if (subSlugAction !== null) {
    return <CompanyChild slugAction={subSlugAction} />
  }

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <CompanyDetail companyId={(slugAction.id as string)} />
    case SlugVerb.CREATE:
      return <EntityChooserForm verb={SlugVerb.CREATE} />
    case SlugVerb.EDIT:
      return <EntityChooserForm
        verb={SlugVerb.EDIT}
        entityId={(slugAction.id as string)}
      />
    default:
      return null
  }
}


export default Company
