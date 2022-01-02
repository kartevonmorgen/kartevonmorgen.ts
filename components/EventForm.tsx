import { Dispatch, FC, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'
import produce from 'immer'
import { Button, Checkbox, DatePicker, Divider, Form, FormInstance, Input, Spin, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validate as validateEmail } from 'isemail'
import { isWebUri } from 'valid-url'
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
import { eventsActions } from '../slices'
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


const { useForm } = Form
const { TextArea } = Input
const { RangePicker } = DatePicker
const { Link } = Typography


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
  const eventId = await createOrEditEvent(adaptedFormValues, isEdit)

  addEventToStateOnCreate(dispatch, adaptedFormValues, isEdit)
  redirectToEvent(router, eventId, isEdit)
}


// todo: any is not a suitable type for dispatch, it should be string[]
const addTouchedAddressFieldName = (setTouchedAddressFields: Dispatch<any>, fieldName: string) => {
  setTouchedAddressFields((prevTouchedAddressFields) =>
    produce(prevTouchedAddressFields, (draft) => {
      draft.push(fieldName)
    }),
  )
}


interface EventFormProps {
  verb: SlugVerb.CREATE | SlugVerb.EDIT
  eventId: EventID
}


const EventForm: FC<EventFormProps> = (props) => {
  const { verb, eventId } = props

  const dispatch = useDispatch()

  const { t } = useTranslation('map')

  const router = useRouter()
  const { query } = router

  const { tag: tagParam } = query
  const tagsFromQuery = convertQueryParamToArray(tagParam)

  const [touchedAddressFields, setTouchedAddressFields] = useState<string[]>([])

  const [form] = useForm<object>()

  // useSetTagsFromRouterToForm(form)

  const newPoint = new Point().fromQuery(query)

  const effectDeps = [...newPoint.toArray()]

  // set address information if the map marker/pin moves
  useEffect(() => {
    if (!newPoint.isEmpty()) {
      setAddressDetailsIfAddressFieldsAreNotTouched(form, newPoint, touchedAddressFields).then()
    }
  }, effectDeps)

  const isEdit = verb === SlugVerb.EDIT

  const { data: event, error: eventError } = useRequest<EventDTO>(isEdit && {
    url: `${API_ENDPOINTS.getEvent()}/${eventId}`,
  })

  if (eventError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  let formInitialValues = {}
  if (isEdit) {
    if (!event) {
      return (
        <div className='center'>
          <Spin size="large"/>
        </div>
      )
    }

    formInitialValues = onReceiveAdapter(event)
    formInitialValues = produce(formInitialValues, (draft) => {
      if (draft) {
        if (!draft['tags']) {
          draft['tags'] = []
        }
        draft['tags'].push(...tagsFromQuery)
      }
    })
  }


  return (
    <Form
      size="middle"
      style={{
        marginTop: 8,
      }}
      initialValues={formInitialValues}
      onFinish={onFinish(
        router,
        dispatch,
        isEdit,
      )}
      form={form}
    >

      <Form.Item name="id" hidden>
        <Input disabled/>
      </Form.Item>

      <Form.Item
        name="title"
        rules={[
          { required: true, message: t('entryForm.requiredField') },
          { min: 3, message: t('entryForm.titleTooShort') },
        ]}
      >
        <Input placeholder={t('entryForm.title')}/>
      </Form.Item>

      <Form.Item
        name="duration"
        rules={[
          { required: true, message: t('entryForm.requiredField') },
        ]}
      >
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          style={{ width: '100%' }}
          placeholder={[t('entryForm.start'), t('entryForm.end')]}
        />
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

      <EntityTagsFormSection form={form}/>

      <Divider orientation="left">{t('entryForm.location')}</Divider>

      <Form.Item>
        <Input.Group compact>
          <Form.Item
            name={'city'}
            noStyle
          >
            <Input
              style={{ width: '50%' }}
              placeholder={t('entryForm.city')}
              onBlur={() => {
                addTouchedAddressFieldName(setTouchedAddressFields, 'city')
                flyToFormAddressAndSetNewPin(router, form).then()
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
              onBlur={() => {
                addTouchedAddressFieldName(setTouchedAddressFields, 'zip')
                flyToFormAddressAndSetNewPin(router, form).then()
              }}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item name="country" hidden/>

      <Form.Item name="state" hidden/>

      <Form.Item name="street">
        <Input
          placeholder={t('entryForm.street')}
          onBlur={() => {
            addTouchedAddressFieldName(setTouchedAddressFields, 'street')
            flyToFormAddressAndSetNewPin(router, form).then()
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
        <Input placeholder="Latitude" disabled/>
      </Form.Item>

      <Form.Item
        name="lng"
        style={{
          display: 'inline-block',
          width: '50%',
        }}
      >
        <Input placeholder="Longitude" disabled/>
      </Form.Item>

      <Divider orientation="left">{t('entryForm.contact')}</Divider>

      <Form.Item name="contact">
        <Input
          placeholder={t('entryForm.contactPerson')}
          prefix={<FontAwesomeIcon icon="user"/>}
        />
      </Form.Item>

      <Form.Item name="telephone">
        <Input
          placeholder={t('entryForm.phone')}
          prefix={<FontAwesomeIcon icon="phone"/>}
        />
      </Form.Item>

      <Form.Item
        name="email"
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
          prefix={<FontAwesomeIcon icon="envelope"/>}
        />
      </Form.Item>

      <Form.Item
        name="homepage"
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
          prefix={<FontAwesomeIcon icon="globe"/>}
        />
      </Form.Item>

      <Form.Item name="created_by" hidden>
        <Input disabled/>
      </Form.Item>

      <Form.Item name="organizer">
        <Input
          placeholder={t('entryForm.contactPerson')}
          prefix={<FontAwesomeIcon icon="user"/>}
        />
      </Form.Item>

      <Form.Item name="registration" hidden>
        <Input disabled/>
      </Form.Item>

      <Divider orientation="left">{t('entryForm.entryImage')}</Divider>

      <Form.Item name="image_url">
        <Input
          placeholder={t('entryForm.imageUrl')}
          prefix={<FontAwesomeIcon icon="camera"/>}
        />
      </Form.Item>

      <Form.Item name="image_link_url">
        <Input
          placeholder={t('entryForm.imageLink')}
          prefix={<FontAwesomeIcon icon="link"/>}
        />
      </Form.Item>

      <Divider orientation="left">{t('entryForm.license')}</Divider>

      <Form.Item
        name="license"
        rules={[
          { required: true, message: t('entryForm.requiredField') },
        ]}
        valuePropName="value"
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
                  target="_blank"
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
        type="primary"
        htmlType="submit"
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
