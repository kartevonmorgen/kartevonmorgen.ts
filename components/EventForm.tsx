import React, { FC } from 'react'
import { Button, Checkbox, Divider, Form, Input, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EventDTO, { EventID } from '../dtos/Event'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { useRouter } from 'next/router'
import useRequest from '../api/useRequest'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugVerb } from '../utils/types'

const { TextArea } = Input


const onCreate = async (event: EventDTO) => {
  await AxiosInstance.PostRequest<EventID>(
    API_ENDPOINTS.postEvent(),
    event,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FALANSTER_TOKEN}`,
      },
    },
  )
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

const onFinish = (isEdit: boolean) => async (event: EventDTO) => {
  if (isEdit) {
    await onEdit(event)

    return
  }

  await onCreate(event)
}

const EventForm: FC = () => {

  const router = useRouter()
  const { query } = router
  const { verb, id: eventId } = getSlugActionFromQuery(query)
  const isEdit = verb === SlugVerb.EDIT

  const { data: event, error: eventError } = useRequest<Event>(isEdit && {
    url: `${API_ENDPOINTS.getEvent()}/${eventId}`,
  })


  if (eventError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (!event && isEdit) {
    return (
      <div className='center'>
        <Spin size="large"/>
      </div>
    )
  }

  return (
    <Form
      size="middle"
      style={{
        marginTop: 8,
      }}
      initialValues={event}
      onFinish={onFinish(isEdit)}
    >

      <Form.Item name="id" hidden>
        <Input disabled/>
      </Form.Item>

      <Form.Item name="title">
        <Input placeholder="Title"/>
      </Form.Item>

      <Form.Item>
        <Input.Group compact>
          <Form.Item
            name={'start'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="Start"/>
          </Form.Item>

          <Form.Item
            name={'end'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="End"/>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item name="description">
        <TextArea placeholder="Description"/>
      </Form.Item>

      <Form.Item name="tags">
        <Input placeholder="Tags"/>
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


      <Form.Item name="address">
        <Input placeholder="Address"/>
      </Form.Item>

      <Form.Item>
        <Input.Group compact>
          <Form.Item
            name={'lat'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="Latitude"/>
          </Form.Item>
          <Form.Item
            name={'lng'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="Longitude"/>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Divider orientation="left">Contact</Divider>

      <Form.Item name="contact">
        <Input placeholder="Contact Person" prefix={<FontAwesomeIcon icon="user"/>}/>
      </Form.Item>

      <Form.Item name="phone">
        <Input placeholder="Phone" prefix={<FontAwesomeIcon icon="phone"/>}/>
      </Form.Item>

      <Form.Item name="email">
        <Input placeholder="Email" prefix={<FontAwesomeIcon icon="envelope"/>}/>
      </Form.Item>

      <Form.Item name="homepage">
        <Input placeholder="homepage" prefix={<FontAwesomeIcon icon="globe"/>}/>
      </Form.Item>

      <Form.Item name="opening_hours">
        <Input placeholder="Opening Hours" prefix={<FontAwesomeIcon icon="clock"/>}/>
      </Form.Item>

      <Divider orientation="left">Image</Divider>

      <Form.Item name="image_url">
        <Input placeholder="URL of an image" prefix={<FontAwesomeIcon icon="camera"/>}/>
      </Form.Item>

      <Form.Item name="image_link_url">
        <Input placeholder="Link" prefix={<FontAwesomeIcon icon="link"/>}/>
      </Form.Item>

      <Divider orientation="left">License</Divider>

      <Form.Item name="license" valuePropName="checked">
        <Checkbox>
          license
        </Checkbox>
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