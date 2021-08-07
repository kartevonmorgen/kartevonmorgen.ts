import React, { FC, Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Checkbox, DatePicker, Divider, Form, FormInstance, Input, Spin, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isValidPhoneNumber } from 'libphonenumber-js'
import EventDTO, { EventID } from '../dtos/Event'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { NextRouter, useRouter } from 'next/router'
import useRequest from '../api/useRequest'
import { redirectToEntityDetail } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import Category from '../dtos/Categories'
import { onReceiveAdapter, onSendAdapter } from '../adaptors/EventForm'
import { AppDispatch } from '../store'
import { eventsActions } from '../slices'
import Point from '../dtos/Point'
import { ExtendedGeocodeAddress, getCityFromAddress, reverseGeocode } from '../utils/geolocation'
import { validate as isValidEmail } from 'isemail'
import TagsSelect from './TagsSelect'
import { InfoCircleOutlined } from '@ant-design/icons'
import ImageURlTutorialModal from './ImageURlTutorialModal'


const { useForm } = Form
const { TextArea } = Input
const { RangePicker } = DatePicker
const { Link } = Typography


const setAddressDetails = async (form: FormInstance, newPoint: Point) => {
  const place = await reverseGeocode(newPoint.toJson())
  const address = place.address as ExtendedGeocodeAddress

  // it's not an error, town and road are optional fields than are not included in the interface
  // but can exist in the response from nominatim
  form.setFieldsValue({
    lat: newPoint.lat,
    lng: newPoint.lng,
    country: address.country,
    city: getCityFromAddress(address),
    state: address.state,
    street: address.road,
    zip: address.postcode,
  })

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

const redirectToEvent = (router: NextRouter, eventId: EventID) => {
  redirectToEntityDetail(
    router,
    eventId,
    Category.EVENT,
    2,
    ['pinLat', 'pinLng'],
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
  redirectToEvent(router, eventId)
}


interface EventFormProps {
  verb: SlugVerb.CREATE | SlugVerb.EDIT
  eventId: EventID
}


const EventForm: FC<EventFormProps> = (props) => {

  const { verb, eventId } = props

  const dispatch = useDispatch()

  const router = useRouter()
  const { query } = router
  const isEdit = verb === SlugVerb.EDIT

  const [form] = useForm<object>()

  const newPoint = new Point().fromQuery(query)

  const effectDeps = [...newPoint.toArray()]

  const [showModalInfo, setShowModalInfo] = useState<boolean>(false)
  const openImageTutorialModal = () => {
    setShowModalInfo(true)
  }

  // set address information if the map marker/pin moves
  useEffect(() => {
    if (!newPoint.isEmpty()) {
      setAddressDetails(form, newPoint).then()
    }

  }, effectDeps)

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
          <Spin size='large' />
        </div>
      )
    }

    formInitialValues = onReceiveAdapter(event)
  }


  return (
    <>
      <Form
        size='middle'
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

        <Form.Item name='id' hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item
          name='title'
          rules={[{ required: true, min: 3 }]}
        >
          <Input placeholder='Title' />
        </Form.Item>

        <Form.Item
          name='duration'
          rules={[{ required: true }]}
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name='description'
          rules={[{ required: true }, { min: 10 }, { max: 250 }]}
        >
          <TextArea placeholder='Description' />
        </Form.Item>

        <Form.Item name='tags'>
          <TagsSelect />
        </Form.Item>

        <Divider orientation='left'>Location</Divider>

        <Form.Item>
          <Input.Group compact>
            <Form.Item
              name={'city'}
              noStyle
            >
              <Input style={{ width: '50%' }} placeholder='City' />
            </Form.Item>
            <Form.Item
              name={'zip'}
              noStyle
            >
              <Input style={{ width: '50%' }} placeholder='Zip' />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item name='country' hidden />

        <Form.Item name='state' hidden />

        <Form.Item name='street'>
          <Input placeholder='Address' />
        </Form.Item>

        <Form.Item
          name='lat'
          style={{
            display: 'inline-block',
            width: '50%',
          }}
        >
          <Input placeholder='Latitude' disabled />
        </Form.Item>

        <Form.Item
          name='lng'
          style={{
            display: 'inline-block',
            width: '50%',
          }}
        >
          <Input placeholder='Longitude' disabled />
        </Form.Item>

        <Divider orientation='left'>Contact</Divider>

        <Form.Item name='contact'>
          <Input placeholder='Contact Person' prefix={<FontAwesomeIcon icon='user' />} />
        </Form.Item>

        <Form.Item
          name='telephone'
          rules={[
            {
              validator: (_, value) => (
                isValidPhoneNumber(value) ?
                  Promise.resolve() :
                  Promise.reject('not a valid phone number')
              ),
            },
          ]}
        >
          <Input placeholder='Phone' prefix={<FontAwesomeIcon icon='phone' />} />
        </Form.Item>

        <Form.Item
          name='email'
          rules={[
            {
              validator: (_, value) => (
                isValidEmail(value) ?
                  Promise.resolve() :
                  Promise.reject('not a valid email')
              ),
            },
          ]}
        >
          <Input placeholder='Email' prefix={<FontAwesomeIcon icon='envelope' />} />
        </Form.Item>

        <Form.Item name='homepage'>
          <Input placeholder='homepage' prefix={<FontAwesomeIcon icon='globe' />} />
        </Form.Item>

        <Form.Item name='created_by' hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item name='organizer'>
          <Input placeholder='organizer' prefix={<FontAwesomeIcon icon='user' />} />
        </Form.Item>

        <Form.Item name='registration' hidden>
          <Input disabled />
        </Form.Item>

        <Divider orientation='left'>Image</Divider>

        <Form.Item name='image_url'>
          <Input placeholder='URL of an image' prefix={<FontAwesomeIcon icon='camera' />} />
          <InfoCircleOutlined
            style={{
              top: '-16px',
              right: '9px',
              position: 'absolute',
              zIndex: 10,
              cursor: 'pointer',
              backgroundColor: 'white',
            }}
            onClick={openImageTutorialModal} />
        </Form.Item>

        <Form.Item name='image_link_url'>
          <Input placeholder='Link' prefix={<FontAwesomeIcon icon='link' />} />
        </Form.Item>

        <Divider orientation='left'>License</Divider>

        <Form.Item
          name='license'
          rules={[{ required: true }]}
          valuePropName='value'
        >
          {/*it's necessary to catch the value of the checkbox, but the out come will be a list*/}
          {/*so we should grab the first element*/}
          <Checkbox.Group
            options={[
              {
                label: <Fragment>
                  {`I have read and accept the Terms of the `}
                  <Link
                    href={process.env.NEXT_PUBLIC_CC_LINK}
                    target='_blank'
                  >
                    Creative-Commons License CC0
                  </Link>
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
          Submit
        </Button>
      </Form>
      <ImageURlTutorialModal
        setShowModalInfo={setShowModalInfo}
        showModalInfo={showModalInfo}
      />
    </>
  )
}

export default EventForm