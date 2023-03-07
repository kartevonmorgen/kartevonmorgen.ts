import { Dispatch, FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Category, { CategoryNameToIdMapper } from '../dtos/Categories'
import EntityFormHeader from './EntryFormHeader'
import { Select } from 'antd'
import { SlugVerb } from '../utils/types'
import EntityForm from './EntityForm'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { convertQueryParamToString } from '../utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { formSelector } from '../selectors/form'
import { FORM_STATUS } from '../slices/formSlice'
import EntityChooserFormSelects from './EntityChooserFormSelects'
import { AppDispatch } from '../store'
import { formActions } from '../slices'


const changeCategory = (setCategory: Dispatch<Category>, dispatch: AppDispatch) => (category: Category) => {
  dispatch(formActions.setCategory(category))
  setCategory(category)
}


interface EntityChooserFormProps {
  category?: Category
  verb: SlugVerb.CREATE | SlugVerb.EDIT
  entityId?: SearchEntryID | EventID
}

const EntityChooserForm: FC<EntityChooserFormProps> = (props) => {
  const { verb, entityId } = props

  const dispatch = useDispatch()

  const formCache = useSelector(formSelector)

  const router = useRouter()
  const { query } = router
  const { addentry: addEntryParam } = query
  const categoryParam = convertQueryParamToString(addEntryParam)

  const [category, setCategory] = useState<Category>(Category.INITIATIVE)
  const shouldCreateANewEntity = verb === SlugVerb.CREATE
  const shouldEditAnExistingEntity = verb === SlugVerb.EDIT


  useEffect(() => {
    if (categoryParam) {
      const categoryParamId = CategoryNameToIdMapper[categoryParam]

      setCategory(categoryParamId)
    }
  }, [categoryParam])

  useEffect(() => {
    if (formCache.status === FORM_STATUS.READY) {
      setCategory(formCache.category)
    }
  }, [])

  useEffect(() => {
    if (formCache.status === FORM_STATUS.READY) {
      setCategory(formCache.category)
      return
    }

    if (props.category) {
      setCategory(props.category)
    }
  }, [props.category])



  return (
    <div style={{ paddingBottom: 60 }}>
      <EntityFormHeader
        isEdit={shouldEditAnExistingEntity}
      />

      <EntityChooserFormSelects
        onSelect={changeCategory(setCategory, dispatch)}
        value={category}
        shouldCreateANewEntity={shouldCreateANewEntity}
      />

      <EntityForm
        category={category}
        verb={verb}
        entityId={entityId}
      />

    </div>
  )
}

export default EntityChooserForm
