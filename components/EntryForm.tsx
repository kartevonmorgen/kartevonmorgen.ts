import React, { FC, Fragment } from 'react'
import { Button, Checkbox, Divider, Form, Input, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons/lib'
import Category from '../dtos/Categories'

const { TextArea } = Input


const onFinish = (value: any) => {
  console.log(value)
}


interface EntryFormProps {
  category?: Category
}

const EntryForm: FC<EntryFormProps> = () => {
  return (
    <Form
      layout="vertical"
      size="middle"
      style={{
        marginTop: 8,
      }}
      initialValues={{ category: Category.INITIATIVE }}
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

      <Form.Item name="License">
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