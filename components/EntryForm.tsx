import React, { FC, Fragment, useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button, Checkbox, Divider, Form, Input, Space, Spin } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons/lib'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getSlugActionFromQuery, redirectToEntityDetail } from '../utils/slug'
import { AxiosInstance } from '../api'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { EntryRequest } from '../dtos/EntryRequest'
import { NewEntryWithLicense } from '../dtos/NewEntryWithLicense'
import { NewEntryWithVersion } from '../dtos/NewEntryWithVersion'
import { Entries as EntriesDTO, Entry } from '../dtos/Entry'
import { SearchEntryID } from '../dtos/SearchEntry'
import { RouterQueryParam, SlugVerb } from '../utils/types'
import { convertQueryParamToFloat } from '../utils/utils'
import { reverseGeocode } from '../utils/geolocation'
import Category from '../dtos/Categories'


const { TextArea } = Input
const { useForm } = Form


// we declare both types NewEntryWithLicense for create, and NewEntryWithVersion for update
type EntryFormType = NewEntryWithLicense | NewEntryWithVersion


const redirectToEntry = (router: NextRouter, entryId: SearchEntryID) => {
  // gotcha: the categories of initiative and company both are mapped to entity so it does not matter
  // what we pass as the category
  // if at any time we decided to make them separate here is the point to touch
  redirectToEntityDetail(
    router,
    entryId,
    Category.INITIATIVE,
    2,
    ['pinLat', 'pinLng'],
  )
}

const onCreate = async (router: NextRouter, entry: NewEntryWithLicense) => {
  // todo: catch errors and show notifications if an error happened

  const response = await AxiosInstance.PostRequest<SearchEntryID>(
    API_ENDPOINTS.postEvent(),
    entry,
  )

  const entryId = response.data as SearchEntryID

  redirectToEntry(router, entryId)
}

const onEdit = async (router: NextRouter, entry: NewEntryWithVersion, entryId: SearchEntryID) => {
  // todo: catch errors and show notifications if an error happened

  await AxiosInstance.PutRequest<SearchEntryID>(
    `${API_ENDPOINTS.postEvent()}/${entryId}`,
    entry,
  )

  redirectToEntry(router, entryId)
}

const onFinish = (
  router: NextRouter,
  isEdit: boolean,
  entryId: SearchEntryID,
) => async (entry: EntryFormType) => {
  // todo: if failed then show a notification
  // todo: if succeed then go to the detail page and remove pinLat and pinLng

  Object.keys(entry).forEach(k => {
    if (!entry[k]) {
      entry[k] = null
    }
  })

  if (isEdit) {
    await onEdit(router, entry as NewEntryWithVersion, entryId)

    return
  }

  await onCreate(router, entry as NewEntryWithLicense)
}

const EntryForm: FC = (_props) => {
  // todo: for a better experience show spinner with the corresponding message when the form is loading
  // for example: fetching the address

  const router = useRouter()
  const { query } = router
  const { verb, id: entryId } = getSlugActionFromQuery(query)

  const [form] = useForm<EntryFormType>()

  // set address information if the map marker/pin moves
  useEffect(() => {
    async function setAddressDetails() {
      const pinLanLng = {
        lat: convertQueryParamToFloat(query.pinLat),
        lng: convertQueryParamToFloat(query.pinLng),
      }

      const place = await reverseGeocode(pinLanLng)
      const { address } = place

      // it's not an error, town and road are optional fields than are not included in the interface
      // but can exist in the response from nominatim
      form.setFieldsValue({
        lat: pinLanLng.lat,
        lng: pinLanLng.lng,
        country: address.country,
        city: address.city || address.town || address.municipality || address.village || address.hamlet,
        state: address.state,
        street: address.road,
        zip: address.postcode,
      })

    }

    setAddressDetails().then()

  }, [query.pinLat, query.pinLng])

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
      onFinish={onFinish(router, isEdit, entryId)}
      form={form}
    >

      <Form.Item name="id" hidden>
        <Input disabled/>
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

      <Form.Item>
        <Input.Group compact>
          <Form.Item
            name={'lat'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="Latitude" disabled/>
          </Form.Item>
          <Form.Item
            name={'lng'}
            noStyle
          >
            <Input style={{ width: '50%' }} placeholder="Longitude" disabled/>
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

      <Form.Item name="license" valuePropName="checked">
        <Checkbox value="CC0-1.0">license</Checkbox>
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