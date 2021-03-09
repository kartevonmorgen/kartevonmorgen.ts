import React, { FC, Fragment } from 'react'
import { Button, Checkbox, Divider, Form, Input, Select, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EntityFormHeader from './EntryFormHeader'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons/lib'

const { TextArea } = Input


const EntryForm: FC = () => {
  return (
    <div style={{ paddingBottom: 52 }}>
      <EntityFormHeader/>

      <Form
        layout="vertical"
        size="middle"
        style={{
          marginTop: 8,
        }}
      >
        <Form.Item name="category">
          <Select placeholder="Category">
            <Select.Option value="initiative">Initiative</Select.Option>
            <Select.Option value="company">Company</Select.Option>
            <Select.Option value="event">Event</Select.Option>
          </Select>
        </Form.Item>

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
              rules={[{ required: true, message: 'Province is required' }]}
            >
              <Input style={{ width: '50%' }} placeholder="City"/>
            </Form.Item>
            <Form.Item
              name={'zip'}
              noStyle
              rules={[{ required: true, message: 'City is required' }]}
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
              rules={[{ required: true, message: 'Latitude is required' }]}
            >
              <Input style={{ width: '50%' }} placeholder="Latitude"/>
            </Form.Item>
            <Form.Item
              name={'lng'}
              noStyle
              rules={[{ required: true, message: 'Longitude is required' }]}
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
                    rules={[{ required: true, message: 'Missing first name' }]}
                  >
                    <Input placeholder="First Name"/>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'last']}
                    fieldKey={[field.fieldKey, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
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

        <Form.Item name="License">
          <Checkbox>license</Checkbox>
        </Form.Item>

      </Form>

    </div>
  )
}

export default EntryForm