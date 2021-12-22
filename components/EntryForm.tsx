import { Dispatch, FC, Fragment, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import produce from 'immer'
import { AppDispatch } from '../store'
import useTranslation from 'next-translate/useTranslation'
import { validate as validateEmail } from 'isemail'
import { isWebUri } from 'valid-url'
import { Button, Checkbox, Divider, Form, FormInstance, Input, Select, Spin, Typography } from 'antd'
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { redirectToEntityDetailAndFlyToLocation } from '../utils/slug'
import { AxiosInstance } from '../api'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { EntryRequest } from '../dtos/EntryRequest'
import { NewEntryWithLicense } from '../dtos/NewEntryWithLicense'
import { NewEntryWithVersion } from '../dtos/NewEntryWithVersion'
import { Entries as EntriesDTO, Entry } from '../dtos/Entry'
import { convertNewEntryToSearchEntry, SearchEntryID } from '../dtos/SearchEntry'
import Point from '../dtos/Point'
import { RouterQueryParam, SlugVerb } from '../utils/types'
import {
  ExtendedGeocodeAddress,
  flyToFormAddressAndSetNewPin,
  getCityFromAddress,
  reverseGeocode,
} from '../utils/geolocation'
import Category from '../dtos/Categories'
import { entriesActions } from '../slices'
import { renameProperties, setValuesToDefaultOrNull, transformObject } from '../utils/objects'
import { prependWebProtocol } from '../utils/utils'
import { ENTITY_DETAIL_DESCRIPTION_LIMIT } from '../consts/texts'
import EntityTagsFormSection from './EntityTagsFormSection'
import useSetTagsFromRouterToForm from '../hooks/useSetTagsFromRouterToForm'


const { useForm } = Form
const { TextArea } = Input
const { Link } = Typography


// we declare both types NewEntryWithLicense for create, and NewEntryWithVersion for update
type EntryFormType = NewEntryWithLicense | NewEntryWithVersion


const setAddressDetailsIfAddressFieldsAreNotTouched = async (
  form: FormInstance,
  newPoint: Point,
  touchedAddressFieldNames: string[],
) => {
  const place = await reverseGeocode(newPoint.toJson())
  const address = place.address as ExtendedGeocodeAddress

  // it's not an error, town and road are optional fields than are not included in the interface
  // but can exist in the response from nominatim
  const fieldsToSetInForm = {
    lat: newPoint.lat,
    lng: newPoint.lng,
    country: address.country,
    city: getCityFromAddress(address),
    state: address.state,
    street: [address.road, address.house_number].join(' ').trim(),
    zip: address.postcode,
  }

  touchedAddressFieldNames.forEach((touchedFieldName) => {
    delete fieldsToSetInForm[touchedFieldName]
  })

  form.setFieldsValue(fieldsToSetInForm)
}

const setFieldsToDefaultOrNull = (entry: EntryFormType): EntryFormType => {
  const defaultFieldValues = {
    tags: [],
    custom_links: [],
    version: 0,
  }

  const entryFormWithDefaultValues = setValuesToDefaultOrNull(entry, defaultFieldValues)

  return entryFormWithDefaultValues
}


const transformFormFields = (entry: EntryFormType): EntryFormType => {
  // the licence should get fetched from the array
  // the version should raise by 1
  const rules = {
    version: (version: number): number => version + 1,
    license: (licenseArray: string[]): string => {
      if (licenseArray.length === 0) {
        return ''
      }

      return licenseArray[0]
    },
    email: (email: string | null | undefined): string | null => {
      if (email === '') {
        return null
      }

      return email
    },
  }

  const fieldsToRename = {
    custom_links: 'links',
  }

  const transformedEntry = transformObject(entry, rules)
  const transformedEntryWithRenamedFields = renameProperties(transformedEntry, fieldsToRename)

  const optionalFieldsToDelete: string[] = ['email']
  const transformedEntryWithRenamedAndDeletedOptionalFields = produce(
    transformedEntryWithRenamedFields,
    (draft) => {
      optionalFieldsToDelete.forEach((optionalField) => {
        if (!draft[optionalField]) {
          delete draft[optionalField]
        }
      })
    },
  )


  return transformedEntryWithRenamedAndDeletedOptionalFields
}


// todo: it's an awful ani-pattern to shake the map to retrieve the entry
// todo: create a class for the changing the router
// todo: create a thunk for prepending the entry to the collection
const redirectToEntry = (router: NextRouter, entryId: SearchEntryID, isEdit: boolean) => {
  // gotcha: the categories of initiative and company both are mapped to entity so it does not matter
  // what we pass as the category
  // if at any time we decided to make them separate here is the point to touch

  const slugLevelsToIgnore = isEdit ? 3 : 2

  redirectToEntityDetailAndFlyToLocation(
    router,
    entryId,
    Category.INITIATIVE,
    slugLevelsToIgnore,
    ['pinCenter'],
  )
}


const addEntryToState = (
  id: SearchEntryID,
  entry: EntryFormType,
  dispatch: AppDispatch,
) => {
  const searchEntry = convertNewEntryToSearchEntry(id, entry)
  dispatch(entriesActions.prependEntry(searchEntry))
}

const onCreate = async (entry: NewEntryWithLicense): Promise<SearchEntryID> => {
  // todo: catch errors and show notifications if an error happened

  const response = await AxiosInstance.PostRequest<SearchEntryID>(
    API_ENDPOINTS.postEntries(),
    entry,
  )

  return response.data
}

const onEdit = async (
  entry: NewEntryWithVersion,
  entryId: SearchEntryID,
) => {
  // todo: catch errors and show notifications if an error happened
  await AxiosInstance.PutRequest<SearchEntryID>(
    `${API_ENDPOINTS.postEntries()}/${entryId}`,
    entry,
  )
}

const createOrEditEntry = async (
  entry: EntryFormType,
  entryId: SearchEntryID,
  isEdit: boolean,
): Promise<SearchEntryID> => {
  if (isEdit) {
    await onEdit(entry as NewEntryWithVersion, entryId)
  } else {
    entryId = await onCreate(entry as NewEntryWithLicense)
  }

  return entryId
}

const addEntryToStateOnCreate = (
  isEdit: boolean,
  id: SearchEntryID,
  entry: EntryFormType,
  dispatch: AppDispatch,
) => {
  if (isEdit) {
    return
  }

  addEntryToState(id, entry, dispatch)
}

const onFinish = (
  router: NextRouter,
  dispatch: AppDispatch,
  isEdit: boolean,
  entryId: SearchEntryID,
) => async (entry: EntryFormType) => {
  // todo: if failed then show a notification
  const entryWithDefaultValues = setFieldsToDefaultOrNull(entry)
  const adaptedEntry = transformFormFields(entryWithDefaultValues)

  entryId = await createOrEditEntry(adaptedEntry, entryId, isEdit)

  addEntryToStateOnCreate(isEdit, entryId, adaptedEntry, dispatch)
  redirectToEntry(router, entryId, isEdit)
}


// todo: any is not a suitable type for dispatch, it should be string[]
const addTouchedAddressFieldName = (setTouchedAddressFields: Dispatch<any>, fieldName: string) => {
  setTouchedAddressFields((prevTouchedAddressFields) =>
    produce(prevTouchedAddressFields, (draft) => {
      draft.push(fieldName)
    }),
  )
}


type EntryCategories = Category.COMPANY | Category.INITIATIVE

interface EntryFormProps {
  category: EntryCategories
  verb: SlugVerb.EDIT | SlugVerb.CREATE
  entryId?: SearchEntryID
}

const EntryForm: FC<EntryFormProps> = (props) => {
  // todo: for a better experience show spinner with the corresponding message when the form is loading
  // for example: fetching the address

  const { category, verb, entryId } = props

  const dispatch = useDispatch()

  const { t } = useTranslation('map')

  const router = useRouter()
  const { query } = router

  const [touchedAddressFields, setTouchedAddressFields] = useState<string[]>([])

  const [form] = useForm<EntryFormType>()

  useSetTagsFromRouterToForm(form)

  const newPoint = new Point().fromQuery(query)

  const effectDeps = [...newPoint.toArray()]

  // set address information if the map marker/pin moves
  useEffect(() => {
    if (!newPoint.isEmpty()) {
      setAddressDetailsIfAddressFieldsAreNotTouched(form, newPoint, touchedAddressFields).then()
    }
  }, effectDeps)

  const isEdit = verb === SlugVerb.EDIT

  const optionalOrgTag: RouterQueryParam = query['org-tag']
  const orgTag = optionalOrgTag && isString(optionalOrgTag) ? optionalOrgTag : null
  const entryRequest: EntryRequest = {
    org_tag: orgTag,
  }

  const { data: entries, error: entriesError } = useRequest<EntriesDTO>(isEdit && {
    url: `${API_ENDPOINTS.getEntries()}/${entryId}`,
    params: entryRequest,
  })


  const foundEntry: boolean = isArray(entries) && entries.length !== 0
  const entry: Entry = foundEntry ? entries[0] : {} as Entry
  // it's an overwrite to be sure it's not empty for the new entries
  entry.categories = [category]


  if (entriesError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (!entries && isEdit) {
    return (
      <div className='center'>
        <Spin size="large"/>
      </div>
    )
  }

  if (!foundEntry && isEdit) {
    //  todo: show not found notification, redirect to the search view
    return null
  }

  return (
      <Form
          layout="vertical"
          size="middle"
          style={{
              marginTop: 8,
          }}
          initialValues={entry}
          onFinish={onFinish(router, dispatch, isEdit, entryId)}
          form={form}
      >
          <Form.Item name="id" hidden>
              <Input disabled />
          </Form.Item>

          {/*the backend accepts an array that's because it's named plural*/}
          {/* but in reality it contains only one category*/}
          {/*and the value is initialized by the parent not the api in the edit mode*/}
          <Form.Item name="categories" hidden>
              <Select mode="multiple" disabled />
          </Form.Item>

          <Form.Item
              name="title"
              rules={[
                  {required: true, message: t('entryForm.requiredField')},
                  {min: 3, message: t('entryForm.titleTooShort')},
              ]}
          >
              <Input placeholder={t('entryForm.title')} />
          </Form.Item>

          <Form.Item
              name="description"
              rules={[
                  {
                      required: true,
                      message: t('entryForm.requiredField'),
                  },
                  {
                      max: 250,
                      message: t('entryForm.keepDescriptionShort', {
                          limit: ENTITY_DETAIL_DESCRIPTION_LIMIT,
                      }),
                      warningOnly: true,
                  },
                  {
                      min: 10,
                      message: `${t('entryForm.descriptionTooShort')} ${t(
                          'entryForm.minNumCharactersDescription',
                      )}`,
                  },
              ]}
          >
              <TextArea showCount placeholder={t('entryForm.description')} />
          </Form.Item>

          <EntityTagsFormSection form={form} />

          <Divider orientation="left">{t('entryForm.location')}</Divider>

          <Form.Item>
              <Input.Group compact>
                  <Form.Item name={'city'} noStyle>
                      <Input
                          style={{width: '50%'}}
                          placeholder={t('entryForm.city')}
                          onBlur={() => {
                              addTouchedAddressFieldName(
                                  setTouchedAddressFields,
                                  'city',
                              );
                              flyToFormAddressAndSetNewPin(router, form).then();
                          }}
                      />
                  </Form.Item>

                  <Form.Item name={'zip'} noStyle>
                      <Input
                          style={{width: '50%'}}
                          placeholder={t('entryForm.zip')}
                          onBlur={() => {
                              addTouchedAddressFieldName(
                                  setTouchedAddressFields,
                                  'zip',
                              );
                              flyToFormAddressAndSetNewPin(router, form).then();
                          }}
                      />
                  </Form.Item>
              </Input.Group>
          </Form.Item>

          <Form.Item name="country" hidden />

          <Form.Item name="state" hidden />

          <Form.Item name="street">
              <Input
                  placeholder={t('entryForm.street')}
                  onBlur={() => {
                      addTouchedAddressFieldName(
                          setTouchedAddressFields,
                          'street',
                      );
                      flyToFormAddressAndSetNewPin(router, form).then();
                  }}
              />
          </Form.Item>

          <Form.Item
              name="lat"
              style={{
                  display: 'inline-block',
                  width: '50%',
              }}
          >
              <Input placeholder="Latitude" disabled />
          </Form.Item>

          <Form.Item
              name="lng"
              style={{
                  display: 'inline-block',
                  width: '50%',
              }}
          >
              <Input placeholder="Longitude" disabled />
          </Form.Item>

          <Divider orientation="left">{t('entryForm.contact')}</Divider>

          <Form.Item name="contact">
              <Input
                  placeholder={t('entryForm.contactPerson')}
                  prefix={<FontAwesomeIcon icon="user" />}
              />
          </Form.Item>

          <Form.Item name="telephone">
              <Input
                  placeholder={t('entryForm.phone')}
                  prefix={<FontAwesomeIcon icon="phone" />}
              />
          </Form.Item>

          <Form.Item
              name="email"
              rules={[
                  {
                      validator: (_, value) => {
                          if (!value) {
                              return Promise.resolve();
                          }

                          const trimmedValue: string = value.trim();

                          if (validateEmail(trimmedValue)) {
                              return Promise.resolve();
                          }

                          return Promise.reject(new Error('not a valid email'));
                      },
                  },
              ]}
          >
              <Input
                  placeholder={t('entryForm.email')}
                  prefix={<FontAwesomeIcon icon="envelope" />}
              />
          </Form.Item>

          <Form.Item
              name="homepage"
              rules={[
                  {
                      validator: (_, value) => {
                          if (!value) {
                              return Promise.resolve();
                          }

                          const trimmedValue: string = value.trim();
                          const valueWithWebProtocol: string =
                              prependWebProtocol(trimmedValue);

                          if (isWebUri(valueWithWebProtocol)) {
                              return Promise.resolve();
                          }

                          return Promise.reject(new Error('not a valid url'));
                      },
                  },
              ]}
          >
              <Input
                  placeholder={t('entryForm.homepage')}
                  prefix={<FontAwesomeIcon icon="globe" />}
              />
          </Form.Item>

          <Form.Item name="opening_hours">
              <Input
                  placeholder={t('entryForm.openingHours')}
                  prefix={<FontAwesomeIcon icon="clock" />}
              />
          </Form.Item>

          <div style={{width: '100%', textAlign: 'center'}}>
              <Link
                  href={process.env.NEXT_PUBLIC_OPENING_HOURS}
                  target="_blank"
              >
                  {t('entryForm.generateHours')}
              </Link>
          </div>

          <Divider orientation="left">{t('entryForm.links')}</Divider>

          <Form.List name="custom">
              {(fields, {add, remove}) => (
                  <Fragment>
                      {fields.map((field) => (
                          <Fragment>
                              <Form.Item
                                  {...field}
                                  name={[field.name, 'url']}
                                  fieldKey={[field.fieldKey, 'url']}
                              >
                                  <Input placeholder={t('entryForm.linkUrl')} />
                              </Form.Item>
                              <Form.Item
                                  {...field}
                                  name={[field.name, 'title']}
                                  fieldKey={[field.fieldKey, 'title']}
                              >
                                  <Input
                                      placeholder={t('entryForm.linkTitle')}
                                  />
                              </Form.Item>
                              <Form.Item
                                  {...field}
                                  name={[field.name, 'description']}
                                  fieldKey={[field.fieldKey, 'description']}
                              >
                                  <Input
                                      placeholder={t(
                                          'entryForm.linkDescription',
                                      )}
                                  />
                              </Form.Item>
                              <Button
                                  onClick={() => remove(field.name)}
                                  block
                                  icon={<MinusCircleOutlined />}
                              >
                                  {t('entryForm.removeField') || 'Remove'}
                              </Button>

                              <Divider dashed />
                          </Fragment>
                      ))}
                      <Form.Item>
                          <Button
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                          >
                              {t('entryForm.addField') || 'Add Field'}
                          </Button>
                      </Form.Item>
                  </Fragment>
              )}
          </Form.List>

          <Divider orientation="left">{t('entryForm.entryImage')}</Divider>

          <Form.Item name="image_url">
              <Input
                  placeholder={t('entryForm.imageUrl')}
                  prefix={<FontAwesomeIcon icon="camera" />}
              />
          </Form.Item>

          <Form.Item name="image_link_url">
              <Input
                  placeholder={t('entryForm.imageLink')}
                  prefix={<FontAwesomeIcon icon="link" />}
              />
          </Form.Item>

          <Divider orientation="left">{t('entryForm.license')}</Divider>

          <Form.Item
              name="license"
              rules={[{required: true, message: t('entryForm.requiredField')}]}
              valuePropName="value"
          >
              {/*it's necessary to catch the value of the checkbox, but the out come will be a list*/}
              {/*so we should grab the first element*/}
              <Checkbox.Group
                  options={[
                      {
                          label: (
                              <Fragment>
                                  {t('entryForm.iHaveRead')}&nbsp;
                                  <Link
                                      href={process.env.NEXT_PUBLIC_CC_LINK}
                                      target="_blank"
                                  >
                                      {t('entryForm.creativeCommonsLicense')}
                                      &nbsp;
                                  </Link>
                                  {t('entryForm.licenseAccepted')}
                              </Fragment>
                          ),
                          value: 'CC0-1.0',
                      },
                  ]}
              />
          </Form.Item>

          <Form.Item name="version" hidden>
              <Input disabled />
          </Form.Item>

          <Button
              type="primary"
              htmlType="submit"
              style={{
                  width: '100%',
              }}
          >
              {t('entryForm.save')}
          </Button>
      </Form>
  );
}

export default EntryForm
