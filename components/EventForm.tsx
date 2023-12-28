import {Dispatch, FC, Fragment, SetStateAction, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'
import { produce } from 'immer'
import { useMount, useUnmount, useDeepCompareEffect } from 'ahooks'
import { Button, Checkbox, Divider, Form, FormInstance, Input, Spin, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validate as validateEmail } from 'isemail'
import { isWebUri } from 'valid-url'
import DatePicker from './DatePicker'
import EventDTO, { EventID } from '../dtos/Event'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { NextRouter, useRouter } from 'next/router'
import useRequest from '../api/useRequest'
import { redirectToEntityDetailAndFlyToLocation } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import Category from '../dtos/Categories'
import { onReceiveAdapter, onSendAdapter } from '../adaptors/EventForm'
import { AppDispatch } from '../store'
import { eventsActions, formActions, viewActions } from '../slices'
import Point from '../dtos/Point'
import {
  ExtendedGeocodeAddress,
  flyToFormAddressAndSetNewPin,
  getCityFromAddress,
  reverseGeocode,
} from '../utils/geolocation'
import { convertQueryParamToArray, prependWebProtocol } from '../utils/utils'
import { ENTITY_DETAIL_DESCRIPTION_LIMIT } from '../consts/texts'
import EntityTagsFormSection from './EntityTagsFormSection'
import { FORM_STATUS } from '../slices/formSlice'
import { formSelector } from '../selectors/form'
import { AxiosError } from 'axios'


const { useForm } = Form
const { TextArea } = Input
const { RangePicker } = DatePicker
const { Link, Paragraph } = Typography


type TouchedAddressFieldName = 'lat' | 'lng' | 'country' | 'city' | 'state' | 'street' | 'zip'


type CreateOrEditEventError = {
  message?: null | string
}

const setAddressDetailsIfAddressFieldsAreNotTouched = async (
  form: FormInstance,
  newPoint: Point,
  touchedAddressFieldNames: TouchedAddressFieldName[],
) => {
  const place = await reverseGeocode(newPoint.toJson())
  const address = place.address as ExtendedGeocodeAddress

  // it's not an error, town and road are optional fields than are not included in the interface
  // but can exist in the response from nominatim
  const fieldsToSetInForm = {
    lat: newPoint.lat,
    lng: newPoint.lng,
    country: address?.country,
    city: getCityFromAddress(address),
    state: address.state,
    street: [address?.road, address?.house_number].join(' ').trim(),
    zip: address?.postcode,
  }

  touchedAddressFieldNames.forEach((touchedFieldName) => {
    delete fieldsToSetInForm[touchedFieldName]
  })

  form.setFieldsValue(fieldsToSetInForm)
}

const addEventToState = (dispatch: AppDispatch, event: EventDTO) => {
  dispatch(eventsActions.prependEvent(event))
}

const addEventToStateOnCreate = (dispatch: AppDispatch, event: EventDTO, isEdit: boolean) => {
  if (isEdit) {
    return
  }

  addEventToState(dispatch, event)
}

const redirectToEvent = (router: NextRouter, eventId: EventID, isEdit: boolean) => {
  const slugLevelsToIgnore = isEdit ? 3 : 2

  redirectToEntityDetailAndFlyToLocation(
    router,
    eventId,
    Category.EVENT,
    slugLevelsToIgnore,
    ['pinCenter'],
  )
}

const onCreate = async (event: EventDTO): Promise<EventID> => {
  const response = await AxiosInstance.PostRequest<EventID>(
    API_ENDPOINTS.postEvent(),
    event,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FALANSTER_TOKEN}`,
      },
    },
  )

  const eventId = response.data as EventID

  return eventId
}


const onEdit = async (event: EventDTO) => {
  await AxiosInstance.PutRequest<EventID>(
    `${API_ENDPOINTS.postEvent()}/${event.id}`,
    event,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FALANSTER_TOKEN}`,
      },
    },
  )
}


const createOrEditEvent = async (
  event: EventDTO,
  isEdit: boolean,
): Promise<EventID> => {
  let eventId: EventID = event.id
  if (isEdit) {
    await onEdit(event)
  } else {
    eventId = await onCreate(event)
  }

  return eventId
}


// todo: it has an issue that we may duplicate the entry in the state twice!
// once manually and the other with the automatic fetching of api!
// double check
const onFinish = (
  router: NextRouter,
  dispatch: AppDispatch,
  isEdit: boolean,
) => async (eventFormValues: any) => {
  // todo: if failed shoe a notification

  const adaptedFormValues = onSendAdapter(eventFormValues)

  let eventId = adaptedFormValues.id
  try {
    eventId = await createOrEditEvent(adaptedFormValues, isEdit)
  } catch (e) {
  const error = e as AxiosError<CreateOrEditEventError>
  const errorMessage = error.response?.data?.message
  if (errorMessage) {
    dispatch(viewActions.setErrorMessage(errorMessage))
  } else {
    console.error(e)
    dispatch(viewActions.setErrorMessage('Submitting form failed!'))
  }
    document.getElementsByClassName('ant-drawer-body')[0].scrollTop = 0
    return
}
  dispatch(formActions.expireFormCache())
  addEventToStateOnCreate(dispatch, adaptedFormValues, isEdit)
  redirectToEvent(router, eventId, isEdit)
}


// todo: any is not a suitable type for dispatch, it should be string[]
const addTouchedAddressFieldName = (setTouchedAddressFields: Dispatch<SetStateAction<string[]>>, fieldName: string) => {
  setTouchedAddressFields((prevTouchedAddressFields) =>
    produce(prevTouchedAddressFields, (draft) => {
      draft.push(fieldName)
    }),
  )
}


interface EventFormProps {
  verb: SlugVerb.CREATE | SlugVerb.EDIT
  eventId: EventID,
}


const EventForm: FC<EventFormProps> = (props) => {
  const { verb, eventId } = props

  const dispatch = useDispatch()

  const formCache = useSelector(formSelector)

  const { t } = useTranslation('map')

  const router = useRouter()
  const { query } = router

  const { tag: tagParam } = query
  const tagsFromQuery = convertQueryParamToArray(tagParam)

  const [touchedAddressFields, setTouchedAddressFields] = useState<string[]>([])

  const [form] = useForm<object>()


  const newPoint = new Point().fromQuery(query)

  const effectDeps = [...newPoint.toArray()]

  // set address information if the map marker/pin moves
  useEffect(() => {
    if (!newPoint.isEmpty()) {
      setAddressDetailsIfAddressFieldsAreNotTouched(form, newPoint, touchedAddressFields as TouchedAddressFieldName[]).then()
    }
  }, effectDeps)

  const isEdit = verb === SlugVerb.EDIT

  const { data: eventResponse, error: eventError } = useRequest<EventDTO>(isEdit ? {
    url: `${API_ENDPOINTS.getEvent()}/${eventId}`,
  } : null)

  let event = eventResponse
  if (formCache.status === FORM_STATUS.READY && formCache.category === Category.EVENT && formCache.data) {
    event = formCache.data as EventDTO
  }

  useDeepCompareEffect(() => {
    let formInitialValues = onReceiveAdapter(event)

    formInitialValues = produce(formInitialValues, (draft) => {
      if (draft) {
        if (!draft['tags']) {
          draft['tags'] = []
        }
        tagsFromQuery.forEach((tag) => {
          if (!draft['tags'].includes(tag)) {
            draft['tags'].push(tag)
          }
        })
      }
    })

    form.setFieldsValue(formInitialValues)
  }, [event])

  useMount(() => {
    dispatch(viewActions.setHighlight(eventId))
  })

  useUnmount(() => {
    dispatch(viewActions.unsetHighlight())
  })

  if (eventError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (isEdit) {
    if (!event) {
      return (
        <div className='center'>
          <Spin size='large' />
        </div>
      )
    }

  }

  return (
    <Form
      size='middle'
      style={{
        marginTop: 8,
      }}
      onFinish={onFinish(
        router,
        dispatch,
        isEdit,
      )}
      form={form}
      onValuesChange={
        (_changedValue: any, formData: object) => {
          const event: EventDTO = onSendAdapter(formData)
          dispatch(formActions.cacheFormData({ category: Category.EVENT, data: event }))
          dispatch(viewActions.setErrorMessage(null))
        }
      }
    >

      <Form.Item name='id' hidden>
        <Input disabled />
      </Form.Item>

      <Form.Item
        name='title'
        rules={[
          { required: true, message: t('entryForm.requiredField') },
          { min: 3, message: t('entryForm.titleTooShort') },
        ]}
      >
        <Input placeholder={t('entryForm.title')} />
      </Form.Item>

      <Form.Item
        name='duration'
        rules={[
          { required: true, message: t('entryForm.requiredField') },
        ]}
      >
        <RangePicker
          changeOnBlur
          showTime={{ format: 'HH:mm' }}
          format='YYYY-MM-DD HH:mm'
          style={{ width: '100%' }}
          placeholder={[t('entryForm.start'), t('entryForm.end')]}
        />
      </Form.Item>

      <Form.Item
        name='description'
        rules={[
          {
            required: true,
            message: t('entryForm.requiredField'),
          },
          {
            max: 250,
            message: t('entryForm.keepDescriptionShort', { limit: ENTITY_DETAIL_DESCRIPTION_LIMIT }),
            warningOnly: true,
          },
          {
            min: 10,
            message: `${t('entryForm.descriptionTooShort')} ${t('entryForm.minNumCharactersDescription')}`,
          },
        ]}
      >
        <TextArea
          showCount
          placeholder={t('entryForm.description')}
        />
      </Form.Item>

      <EntityTagsFormSection form={form} />

      <Divider orientation='left'>{t('entryForm.location')}</Divider>

      <Form.Item>
        <Input.Group compact>
          <Form.Item
            name={'city'}
            noStyle
          >
            <Input
              style={{ width: '50%' }}
              placeholder={t('entryForm.city')}
              onBlur={async () => {
                addTouchedAddressFieldName(setTouchedAddressFields, 'city')
                try {
                  await flyToFormAddressAndSetNewPin(router, form).then()
                } catch (e) {
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name={'zip'}
            noStyle
          >
            <Input
              style={{ width: '50%' }}
              placeholder={t('entryForm.zip')}
              onBlur={async () => {
                addTouchedAddressFieldName(setTouchedAddressFields, 'zip')
                try {
                  await flyToFormAddressAndSetNewPin(router, form).then()
                } catch (e) {
                }
              }}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item name='country' hidden />

      <Form.Item name='state' hidden />

      <Form.Item name='street'>
        <Input
          placeholder={t('entryForm.street')}
          onBlur={async () => {
            addTouchedAddressFieldName(setTouchedAddressFields, 'street')
            try {
              await flyToFormAddressAndSetNewPin(router, form).then()
            } catch (e) {
            }
          }}
        />
      </Form.Item>

      <Paragraph>{t('entryForm.clickOnMap')}</Paragraph>

      <Form.Item
        name='lat'
        style={{
          display: 'inline-block',
          width: '50%',
        }}
        rules={[{required: true, message: t('entryForm.requiredField')}]}
      >
        <Input placeholder='Latitude' disabled />
      </Form.Item>

      <Form.Item
        name='lng'
        style={{
          display: 'inline-block',
          width: '50%',
        }}
        rules={[{required: true, message: t('entryForm.requiredField')}]}
      >
        <Input placeholder='Longitude' disabled />
      </Form.Item>

      <Divider orientation='left'>{t('entryForm.contact')}</Divider>

      <Form.Item name='organizer'>
        <Input
          placeholder={t('entryForm.contactPerson')}
          prefix={<FontAwesomeIcon icon='user' />}
        />
      </Form.Item>

      <Form.Item name='telephone'>
        <Input
          placeholder={t('entryForm.phone')}
          prefix={<FontAwesomeIcon icon='phone' />}
        />
      </Form.Item>

      <Form.Item
        name='email'
        rules={[
          {
            validator: (_, value) => {
              if (!value) {
                return Promise.resolve()
              }

              const trimmedValue: string = value.trim()

              if (validateEmail(trimmedValue)) {
                return Promise.resolve()
              }

              return Promise.reject(new Error('not a valid email'))
            },
          },
        ]}
      >
        <Input
          placeholder={t('entryForm.email')}
          prefix={<FontAwesomeIcon icon='envelope' />}
        />
      </Form.Item>

      <Form.Item
        name='homepage'
        rules={[
          {
            validator: (_, value) => {
              if (!value) {
                return Promise.resolve()
              }

              const trimmedValue: string = value.trim()
              const valueWithWebProtocol: string = prependWebProtocol(trimmedValue)

              if (isWebUri(valueWithWebProtocol)) {
                return Promise.resolve()
              }

              return Promise.reject(new Error('not a valid url'))
            },
          },
        ]}
      >
        <Input
          placeholder={t('entryForm.homepage')}
          prefix={<FontAwesomeIcon icon='globe' />}
        />
      </Form.Item>

      <Form.Item name='created_by' hidden>
        <Input disabled />
      </Form.Item>

      <Form.Item name='registration' hidden>
        <Input disabled />
      </Form.Item>

      <Divider orientation='left'>{t('entryForm.entryImage')}</Divider>

      <Form.Item name='image_url'>
        <Input
          placeholder={t('entryForm.imageUrl')}
          prefix={<FontAwesomeIcon icon='camera' />}
        />
      </Form.Item>

      <Form.Item name='image_link_url'>
        <Input
          placeholder={t('entryForm.imageLink')}
          prefix={<FontAwesomeIcon icon='link' />}
        />
      </Form.Item>

      <Divider orientation='left'>{t('entryForm.license')}</Divider>

      <Form.Item
        name='license'
        rules={[
          { required: true, message: t('entryForm.requiredField') },
        ]}
        valuePropName='value'
      >
        {/* it's necessary to catch the value of the checkbox, but the out come will be a list*/}
        {/* so we should grab the first element*/}
        <Checkbox.Group
          options={[
            {
              label: <Fragment>
                {t('entryForm.iHaveRead')}&nbsp;
                <Link
                  href={process.env.NEXT_PUBLIC_CC_LINK}
                  target='_blank'
                >
                  {t('entryForm.creativeCommonsLicense')}&nbsp;
                </Link>
                {t('entryForm.licenseAccepted')}
              </Fragment>,
              value: 'CC0-1.0',
            },
          ]}
        />
      </Form.Item>


      <Button
        type='primary'
        htmlType='submit'
        style={{
          width: '100%',
        }}
      >
        {t('entryForm.save')}
      </Button>

    </Form>
  )
}

export default EventForm
