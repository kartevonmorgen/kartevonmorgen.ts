import { Dispatch, FC, useEffect, useRef, useState } from 'react'
import Category from '../dtos/Categories'
import EntityFormHeader from './EntryFormHeader'
import { SlugVerb } from '../utils/types'
import EntityForm from './EntityForm'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
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

  const isFormInitialized = useRef<boolean>(false)

  const dispatch = useDispatch()

  const formCache = useSelector(formSelector)

  const [category, setCategory] = useState<Category>(Category.INITIATIVE)
  const shouldCreateANewEntity = verb === SlugVerb.CREATE
  const shouldEditAnExistingEntity = verb === SlugVerb.EDIT


  useEffect(() => {
    if (formCache.status === FORM_STATUS.READY && formCache.category) {
      setCategory(formCache.category)
    }
  }, [])

  useEffect(() => {
    let newCategory = props.category
    if (!props.category) {
      newCategory = Category.INITIATIVE
    }
    setCategory(newCategory)
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
        setCategory={setCategory}
        isFormInitialized={isFormInitialized}
      />

    </div>
  )
}

export default EntityChooserForm
