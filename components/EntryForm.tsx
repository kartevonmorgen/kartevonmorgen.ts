import React, { FC, Fragment } from 'react'
import { Button, Checkbox, Divider, Form, Input, Space, Spin } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons/lib'
import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import useRequest from '../api/useRequest'
import { Entries as EntriesDTO, Entry } from '../dtos/Entry'
import { RouterQueryParam } from '../utils/types'
import isString from 'lodash/isString'
import { EntryRequest } from '../dtos/EntryRequest'
import API_ENDPOINTS from '../api/endpoints'
import isArray from 'lodash/isArray'

const { TextArea } = Input


const onFinish = (value: any) => {
  console.log(value)
}


const EntryForm: FC = (_props) => {
  const router = useRouter()
  const { query } = router
  const slugAction = getSlugActionFromQuery(query)
  const hasId = !!slugAction.id

  const optionalOrgTag: RouterQueryParam = query['org-tag']
  const orgTag = optionalOrgTag && isString(optionalOrgTag) ? optionalOrgTag : null
  const entryRequest: EntryRequest = {
    org_tag: orgTag,
  }

  const { data: entries, error: entriesError } = useRequest<EntriesDTO>(hasId && {
    url: `${API_ENDPOINTS.getEntries()}/${slugAction.id}`,
    params: entryRequest,
  })

  const foundEntry: boolean = isArray(entries) && entries.length !== 0
  const entry: Entry = foundEntry ? entries[0] : {} as Entry

  if (entriesError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (!entries && hasId) {
    return (
      <div className='center'>
        <Spin size="large"/>
      </div>
    )
  }

  if (!foundEntry && hasId) {
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
      onFinish={onFinish}
    >
      <Form.Item name="title">
        <Input placeholder="Title"/>
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

      <Divider orientation="left">Links and Social Media</Divider>

      <Form.List name="custom_links">
        {(fields, { add, remove }) => (
          <Fragment>
            {fields.map(field => (
              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...field}
                  name={[field.name, 'first']}
                  fieldKey={[field.fieldKey, 'first']}
                >
                  <Input placeholder="First Name"/>
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'last']}
                  fieldKey={[field.fieldKey, 'last']}
                >
                  <Input placeholder="Last Name"/>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)}/>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                Add field
              </Button>
            </Form.Item>
          </Fragment>
        )}
      </Form.List>

      <Divider orientation="left">Image</Divider>

      <Form.Item name="image_url">
        <Input placeholder="URL of an image" prefix={<FontAwesomeIcon icon="camera"/>}/>
      </Form.Item>

      <Form.Item name="image_link_url">
        <Input placeholder="Link" prefix={<FontAwesomeIcon icon="link"/>}/>
      </Form.Item>

      <Divider orientation="left">License</Divider>

      <Form.Item name="License" valuePropName="checked">
        <Checkbox>license</Checkbox>
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

export default EntryForm