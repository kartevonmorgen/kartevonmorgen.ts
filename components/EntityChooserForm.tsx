import { Dispatch, FC, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Alert } from 'antd'
import { SlugVerb } from '../utils/types'
import { convertQueryParamToString } from '../utils/utils'
import Category, { CategoryNameToIdMapper } from '../dtos/Categories'
import EntityFormHeader from './EntryFormHeader'
import EntityForm from './EntityForm'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { formSelector } from '../selectors/form'
import { FORM_STATUS } from '../slices/formSlice'
import EntityChooserFormSelects from './EntityChooserFormSelects'
import { AppDispatch } from '../store'
import { formActions, RootState } from '../slices'
import { errorMessageSelector } from '../selectors/view'


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
  const { verb, entityId, category: categoryProp } = props

  const errorMessage = useSelector((state: RootState) => errorMessageSelector(state))

  const router = useRouter()
  const { query } = router
  const { addentry: addEntryParam } = query
  const categoryParam = convertQueryParamToString(addEntryParam)

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
    let newCategory = categoryProp
    if (categoryParam) {
      newCategory = CategoryNameToIdMapper[categoryParam]
    }
    if (newCategory) {
      setCategory(newCategory)
    }

  }, [categoryParam, categoryProp])

  return (
    <div
      style={{ paddingBottom: 60 }}
    >
      <EntityFormHeader
        isEdit={shouldEditAnExistingEntity}
      />

      {
        errorMessage && (
          <Alert
            closable
            message={errorMessage}
            type="error"
            style={{
              marginBottom: '1rem'
            }}
          />
        )
      }

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
