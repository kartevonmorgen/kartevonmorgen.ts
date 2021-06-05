import React, { FC, Fragment } from 'react'
import { Button, Checkbox, DatePicker, Divider, Form, Input, Select, Spin, Typography } from 'antd'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EventDTO, { EventID } from '../dtos/Event'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { NextRouter, useRouter } from 'next/router'
import useRequest from '../api/useRequest'
import { getSlugActionFromQuery, redirectToEntityDetail } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import Category from '../dtos/Categories'
import {
  addPropertiesWithNewName,
  propertyArray,
  removeProperties,
  TransformerWithNewNameRuleSet,
} from '../utils/objects'


const { TextArea } = Input
const { RangePicker } = DatePicker
const { Link } = Typography


const redirectToEvent = (router: NextRouter, eventId: EventID) => {
  redirectToEntityDetail(
    router,
    eventId,
    Category.EVENT,
    2,
    ['pinLat', 'pinLng'],
  )
}

const onCreate = async (router: NextRouter, event: EventDTO) => {
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

  redirectToEvent(router, eventId)
}


const onEdit = async (router: NextRouter, event: EventDTO) => {
  await AxiosInstance.PutRequest<EventID>(
    `${API_ENDPOINTS.postEvent()}/${event.id}`,
    event,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FALANSTER_TOKEN}`,
      },
    },
  )

  redirectToEvent(router, event.id)
}

const onFinish = (router: NextRouter, isEdit: boolean) => async (event: EventDTO) => {
  if (isEdit) {
    await onEdit(router, event)

    return
  }

  await onCreate(router, event)
}

// todo: should move the function to the adaptors directory
// todo: should create a type for the form initialValue, any is not the best option
const onReceiveAdapter = (event: EventDTO): object => {
  // the start and end should get converted
  const ruleSetsToAddNewProperties: TransformerWithNewNameRuleSet = {
    duration: {
      transformer: (originalValue, originalObject: EventDTO) => ([
        moment.unix(originalObject.start),
        moment.unix(originalObject.end),
      ]),
      originalPropertyName: null,
    },
  }

  const eventWithNewProperties = addPropertiesWithNewName(event, ruleSetsToAddNewProperties)

  const propertiesToRemove: propertyArray = ['start', 'end']
  const eventWithPrunedProperties = removeProperties(eventWithNewProperties, propertiesToRemove)

  return eventWithPrunedProperties
}


// just to keep the doors open for OCP, not the best way but lets try
interface EventFormProps {
  category: Category.EVENT
}

const EventForm: FC<EventFormProps> = (_props) => {

  const router = useRouter()
  const { query } = router
  const { verb, id: eventId } = getSlugActionFromQuery(query)
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
  }


  return (
    <Form
      size="middle"
      style={{
        marginTop: 8,
      }}
      initialValues={formInitialValues}
      onFinish={onFinish(router, isEdit)}
    >

      <Form.Item name="id" hidden>
        <Input disabled/>
      </Form.Item>

      <Form.Item name="title">
        <Input placeholder="Title"/>
      </Form.Item>

      <Form.Item name="duration">
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item name="description">
        <TextArea placeholder="Description"/>
      </Form.Item>

      <Form.Item name="tags">
        <Select
          mode="tags"
          allowClear
          style={{ width: '100%' }}
          placeholder="Tags"
        >
          {/*  rendering options should go here*/}
        </Select>
      </Form.Item>

      <Divider orientation="left">Location</Divider>

      <Form.Item>
        <Input.Group compact>
          <Form.Item
            name={'city'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="City"/>
          </Form.Item>
          <Form.Item
            name={'zip'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="Zip"/>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item name="country" hidden/>

      <Form.Item name="state" hidden/>

      <Form.Item name="street">
        <Input placeholder="Address"/>
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

      <Divider orientation="left">Contact</Divider>

      <Form.Item name="contact">
        <Input placeholder="Contact Person" prefix={<FontAwesomeIcon icon="user"/>}/>
      </Form.Item>

      <Form.Item name="telephone">
        <Input placeholder="Phone" prefix={<FontAwesomeIcon icon="phone"/>}/>
      </Form.Item>

      <Form.Item name="email">
        <Input placeholder="Email" prefix={<FontAwesomeIcon icon="envelope"/>}/>
      </Form.Item>

      <Form.Item name="homepage">
        <Input placeholder="homepage" prefix={<FontAwesomeIcon icon="globe"/>}/>
      </Form.Item>

      {/*todo: duplicate it with the email contact for now*/}
      <Form.Item name="created_by" hidden>
        <Input disabled/>
      </Form.Item>

      <Form.Item name="organizer">
        <Input placeholder="organizer" prefix={<FontAwesomeIcon icon="user"/>}/>
      </Form.Item>

      <Form.Item name="registration" hidden>
        <Input disabled/>
      </Form.Item>

      <Divider orientation="left">Image</Divider>

      <Form.Item name="image_url">
        <Input placeholder="URL of an image" prefix={<FontAwesomeIcon icon="camera"/>}/>
      </Form.Item>

      <Form.Item name="image_link_url">
        <Input placeholder="Link" prefix={<FontAwesomeIcon icon="link"/>}/>
      </Form.Item>

      <Divider orientation="left">License</Divider>

      <Form.Item
        name="license"
        rules={[{ required: true }]}
        valuePropName="value"
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
                  target="_blank"
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
        type="primary"
        htmlType="submit"
        style={{
          width: '100%',
        }}
      >
        Submit
      </Button>

    </Form>
  )
}

export default EventForm