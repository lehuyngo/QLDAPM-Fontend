import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Col, Dropdown, Form, Row, Select, Spin, Upload } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiEdit2 } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useAcceptCard,
  useDeleteCard,
  useGetCardDetail,
  useGetCardList
} from '../../../api/reactQuery/Card'
import { useGetClientsList } from '../../../api/reactQuery/Client'
import { useGetContactsList } from '../../../api/reactQuery/Contact'
import { useGetTags } from '../../../api/reactQuery/Tag'
import ScreenshotCapture from '../../../component/capture'
import {
  StyledButton,
  StyledInput,
  StyledSelect
} from '../../../component/componentOfForm/ComponentOfForm.style'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import { NotificationCustom } from '../../../component/notification/Notification'
import { ALLOW_FILE } from '../../../constants/common'
import { useDebounce } from '../../../hooks/useDebounce'
import UploadImageDefault from '../../../resources/images/image-default.jpg'
import {
  addUniqueColors,
  clearSpaceString,
  useGetScreenHeight,
  useGetScreenWidth
} from '../../../utils/FunctionsShare'
import { sortDataByActiveTime } from '../../../utils/SortData'
import useAutoFocus from '../../../utils/autoFocus'
import { beforeUploadImage } from '../../../utils/handleFileUpLoad'
import CrmPageLayout from '../../layout'
import {
  ButtonNextPreviousStyled,
  CaptureWrapper,
  FormCardDetailLayout
} from '../style'
import { convertBase64ToImageFile, isBase64 } from './HandleData'

const CardDetail = () => {
  const [imageLogo, setImageLogo] = useState<any>(null)
  const [isShowCapture, setIsShowCapture] = useState<boolean>(false)
  const [acceptLoading, setAcceptLoading] = useState<boolean>(false)
  const [openDeleteForm, setOpenDeleteForm] = useState<boolean>(false)
  const [isDropdownClientsVisible, setDropdownClientsVisible] = useState(false)
  const [searchClientName, setSearchClientName] = useState('')
  const [selectedClientNameKeys, setSelectedClientNameKeys] = useState<
    string[]
  >([])
  const [isDropdownContactsVisible, setDropdownContactsVisible] =
    useState(false)
  const [searchContactName, setSearchContactName] = useState('')
  const [selectedContactNameKeys, setSelectedContactNameKeys] = useState<
    string[]
  >([])

  const debouncedSearchClientName = useDebounce(searchClientName, 500)
  const debouncedSearchContactName = useDebounce(searchContactName, 500)
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const { cardID = null } = useParams()
  const navigate = useNavigate()
  const btnAcceptRef = useRef<any>(null)
  const useFullWidth = useGetScreenWidth()
  const useFullHeight =
    useGetScreenHeight() - 64 - 12 * 4 - 16 - 16 * 6 - (16 + 40 * 2) - 4 // Estimate +-4px
  useAutoFocus(btnAcceptRef, true)

  const { mutate: mutateAccept } = useMutation({ mutationFn: useAcceptCard })
  const { mutate: mutateDelete } = useMutation({ mutationFn: useDeleteCard })

  const { data: cardDetail, isFetching: cardDetailLoading } = useGetCardDetail({
    uuid: cardID
  })
  const { data: cardList } = useGetCardList()
  const { data: tagContact, isLoading: tagContactLoading } =
    useGetTags('contact')
  const { data: tagClient, isLoading: tagClientLoading } = useGetTags('client')
  const { data: clientList, isLoading: clientListLoading } = useGetClientsList()
  const { data: contactList, isLoading: contactListLoading } =
    useGetContactsList()

  const clientListCanPicked = clientList?.data?.filter((c: any) => {
    let name = c.shortname || c.fullname
    return (
      (!debouncedSearchClientName && cardDetail?.client_name) ||
      name.toLowerCase().includes(debouncedSearchClientName?.toLowerCase())
    )
  })

  const contactListCanPicked = contactList?.data?.filter((c: any) => {
    let name = c.shortname || c.fullname
    return (
      (!debouncedSearchContactName && cardDetail?.fullname) ||
      name.toLowerCase().includes(debouncedSearchContactName?.toLowerCase())
    )
  })

  const sortedData = sortDataByActiveTime(cardList?.data)

  const findCardIndex = (cardId: string) => {
    return sortedData?.findIndex((card: any) => card.uuid === cardId)
  }

  const currentCardIndex = cardID && findCardIndex(cardID)
  const isAtFirstItem = cardID && findCardIndex(cardID) === 0
  const isAtLastItem =
    cardID && findCardIndex(cardID) === sortedData?.length - 1

  useEffect(() => {
    if (cardDetail) {
      const { company_logo, client_name, fullname } = cardDetail

      form.setFieldsValue(cardDetail)

      if (client_name) {
        setSearchClientName(client_name)
      }

      if (fullname) {
        setSearchContactName(fullname)
      }

      if (company_logo?.url) {
        setImageLogo(company_logo.url)
      } else {
        setImageLogo(null)
      }
    }
  }, [form, cardDetail])

  const handleAccept = () => {
    form
      .validateFields()
      .then((values) => {
        onAccept(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const onAccept = (values: any) => {
    const {
      client_address,
      client_name,
      client_website,
      email,
      fullname,
      phone,
      contact_tag,
      client_tag
    } = values || {}

    const formData = new FormData()

    if (client_address) {
      formData.append('client_address', client_address)
    }

    if (client_name) {
      formData.append('client_name', clearSpaceString(client_name))
    }

    if (client_website) {
      formData.append('client_website', client_website)
    }

    if (email) {
      formData.append('email', email)
    }

    if (fullname) {
      formData.append('fullname', clearSpaceString(fullname))
    }

    if (phone) {
      formData.append('phone', phone)
    }

    if (contact_tag && contact_tag.length > 0) {
      const tagsSend = addUniqueColors(contact_tag)
      formData.append('tags', tagsSend)
    }

    if (client_tag && client_tag.length > 0) {
      const tagsSend = addUniqueColors(client_tag)
      formData.append('client_tags', tagsSend)
    }

    if (isBase64(imageLogo)) {
      const fileInfo = convertBase64ToImageFile(imageLogo)

      fileInfo && formData.set('company_logo', fileInfo)
    } else if (values.logo && values.logo.length > 0) {
      formData.set('company_logo', values.logo[0].originFileObj)
    }

    const dataSend = {
      formData: formData,
      cardId: cardID
    }

    setAcceptLoading(true)

    mutateAccept(dataSend, {
      onSuccess: () => {
        onDeleteThisCard(cardDetail?.uuid)
        setAcceptLoading(false)
        NotificationCustom({
          type: 'success',
          message: 'Accepted success'
        })
      },
      onError: (error) => {
        setAcceptLoading(false)
        NotificationCustom({
          type: 'error',
          message: 'Accept fail',
          description: error.message
        })
      }
    })
  }

  const onDeleteThisCard = (cardId: string) => {
    setAcceptLoading(true)
    mutateDelete(cardId, {
      onSuccess(data, variables, context) {
        if (sortedData?.length === 1) {
          navigate(`/cards`)
        } else {
          isAtLastItem ? handlePreviousCard() : handleNextCard()
        }
        setAcceptLoading(false)
        setOpenDeleteForm(false)
        queryClient.invalidateQueries({ queryKey: ['GetCardList'] })
        form.resetFields()
      },
      onError(error) {
        setAcceptLoading(false)
        NotificationCustom({
          type: 'error',
          message: 'Accept fail',
          description: error.message
        })
      }
    })
  }

  //next or pre card
  const handleNextCard = () => {
    const nextCardIndex = Math.min(currentCardIndex + 1, sortedData.length - 1)
    const nextCardId = sortedData[nextCardIndex]?.uuid

    if (nextCardId) {
      navigate(`/card/${nextCardId}`)
    }
  }

  const handlePreviousCard = () => {
    const previousCardIndex = Math.max(currentCardIndex - 1, 0)
    const previousCardId = sortedData[previousCardIndex]?.uuid

    if (previousCardId) {
      navigate(`/card/${previousCardId}`)
    }
  }

  return (
    <>
      <CrmPageLayout>
        <FormCardDetailLayout
          $useFulHeight={useFullHeight}
          $useFullWidth={useFullWidth}
        >
          {cardDetailLoading && (
            <Spin style={{ position: 'absolute', left: '50%', top: '10vh' }} />
          )}

          <Form
            layout='vertical'
            requiredMark={false}
            form={form}
            onFinish={handleAccept}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name='name_card' className='h-4-7 customize-height'>
                  <CaptureWrapper $useFulHeight={useFullHeight}>
                    <div
                      className='capture-content'
                      onMouseLeave={() => setIsShowCapture(false)}
                      onMouseEnter={() => setIsShowCapture(true)}
                    >
                      {isShowCapture ? (
                        <ScreenshotCapture
                          type='name-card'
                          oldSrc={cardDetail?.name_card?.url}
                          onEndCapture={(url: string) => setImageLogo(url)}
                        />
                      ) : (
                        <div className='no-capture'>
                          <ImageWithAuth
                            url={cardDetail?.name_card?.url}
                            preview={false}
                            type='name-card'
                          />
                        </div>
                      )}
                    </div>
                  </CaptureWrapper>
                </Form.Item>

                <Dropdown
                  menu={{
                    items: contactListCanPicked?.map((item: any) => ({
                      label: `${item.shortname || item.fullname}${
                        item.email ? ` - ${item.email}` : ''
                      }`,
                      key: item.uuid
                    })),
                    selectable: true,
                    selectedKeys: selectedContactNameKeys,
                    onDeselect: (e) => {
                      setSelectedContactNameKeys([])
                      if (cardDetail) {
                        form.setFieldsValue({
                          fullname: cardDetail.fullname,
                          email: cardDetail.email
                        })
                        setSearchContactName(cardDetail.fullname)
                      }
                    },
                    onSelect: (e) => {
                      setSelectedContactNameKeys([e.key])
                      let contact = contactListCanPicked.find(
                        (c: any) => c.uuid === e.key
                      )
                      if (contact) {
                        form.setFieldsValue({
                          fullname: contact.shortname || contact.fullname,
                          email: contact.email
                        })
                        setSearchContactName(
                          contact.shortname || contact.fullname
                        )
                      }
                    }
                  }}
                  trigger={['click']}
                  open={
                    contactListCanPicked?.length > 0 &&
                    isDropdownContactsVisible
                  }
                  onOpenChange={(open) => setDropdownContactsVisible(open)}
                >
                  <Form.Item
                    label={
                      <>
                        Contact Name&nbsp;
                        <span style={{ color: 'red' }}> (*)</span>
                      </>
                    }
                    name='fullname'
                    className='h-1-7 customize-height'
                    rules={[
                      {
                        required: true,
                        message: 'This field is required!'
                      },
                      { type: 'string' }
                    ]}
                  >
                    <StyledInput
                      placeholder='Contact name'
                      onChange={(e) => {
                        setDropdownContactsVisible(true)
                        setSearchContactName(e.target.value)
                      }}
                    />
                  </Form.Item>
                </Dropdown>

                <Form.Item
                  label={
                    <>
                      Email&nbsp;
                      <span style={{ color: 'red' }}> (*)</span>
                    </>
                  }
                  name='email'
                  className='h-1-7 customize-height'
                  rules={[
                    { required: true, message: 'This field is required!' },
                    { type: 'email' }
                  ]}
                >
                  <StyledInput placeholder='Name new label' />
                </Form.Item>

                <Form.Item
                  label="Contact's tag"
                  name='contact_tag'
                  className='h-1-7 customize-height'
                >
                  <StyledSelect
                    maxTagCount='responsive'
                    maxTagTextLength={20}
                    mode='tags'
                    style={{ width: '100%' }}
                    placeholder='Select tags'
                    allowClear
                  >
                    {tagContact?.data?.map((item: any) => (
                      <Select.Option key={item.name} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Form.Item>

                {/* <Form.Item
                  label="Contact's tag"
                  name='contact_tags'
                  className='h-1-7 customize-height'
                >
                  <StyledSelect
                    maxTagCount='responsive'
                    maxTagTextLength={20}
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder='Select tags'
                    allowClear
                    onChange={handleTagContactChange}
                    value={selectedContactTags}
                    onInputKeyDown={handleAddTagContact}
                    onSearch={handleContactSearch}
                    searchValue={searchContactValue}
                  >
                    {tagContactList?.map((item: any) => (
                      <Select.Option key={item.name} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Form.Item> */}
              </Col>

              <Col span={12}>
                <Form.Item
                  name='logo'
                  label='Logo'
                  className='h-2-7 logo-client customize-height'
                  valuePropName='fileList'
                  getValueFromEvent={(e) => e.fileList}
                  rules={[{ required: false }]}
                >
                  <Upload
                    accept={ALLOW_FILE.IMAGE.join(',')}
                    customRequest={() => {}}
                    showUploadList={false}
                    name='logo'
                    className='client-upload-logo'
                    listType='picture-card'
                    maxCount={1}
                    beforeUpload={beforeUploadImage}
                    onChange={(e) => {
                      let type = e.file.type as String
                      let size = e.file.size ? e.file.size : null
                      if (
                        type.startsWith('image/') &&
                        size &&
                        size / 1024 / 1024 <= 10
                      ) {
                        setImageLogo(e.fileList)
                      }
                    }}
                  >
                    <div className='client-upload-image'>
                      {imageLogo &&
                        typeof imageLogo === 'string' &&
                        !imageLogo.includes('base64') && (
                          <div className='img-logo'>
                            <ImageWithAuth url={imageLogo} preview={false} />
                          </div>
                        )}
                      {imageLogo &&
                        typeof imageLogo === 'string' &&
                        imageLogo.includes('base64') && (
                          <div className='img-logo'>
                            <img src={imageLogo} alt='img' />
                          </div>
                        )}
                      {imageLogo && typeof imageLogo !== 'string' && (
                        <img
                          className='img-logo'
                          src={URL.createObjectURL(imageLogo[0]?.originFileObj)}
                          alt='upload img default'
                        />
                      )}
                      {!imageLogo && (
                        <img
                          className='img-logo'
                          src={UploadImageDefault}
                          alt='upload img default'
                        />
                      )}
                      <div className='edit-icon'>
                        <FiEdit2 style={{ fontSize: '14px', color: '#333' }} />
                      </div>
                    </div>
                  </Upload>
                </Form.Item>

                <Form.Item
                  className='h-1-7 customize-height'
                  label={<>Website</>}
                  name='client_website'
                  rules={[]}
                >
                  <StyledInput placeholder='Client website' />
                </Form.Item>
                <Dropdown
                  menu={{
                    items: clientListCanPicked?.map((item: any) => ({
                      label: `${item.shortname || item.fullname}`,
                      key: item.uuid
                    })),
                    selectable: true,
                    selectedKeys: selectedClientNameKeys,
                    onDeselect: (e) => {
                      setSelectedClientNameKeys([])
                      if (cardDetail) {
                        form.setFieldsValue({
                          client_name: cardDetail.client_name
                        })
                        setSearchClientName(cardDetail.client_name)
                      }
                    },
                    onSelect: (e) => {
                      setSelectedClientNameKeys([e.key])
                      let client = clientListCanPicked.find(
                        (c: any) => c.uuid === e.key
                      )
                      if (client) {
                        form.setFieldsValue({
                          client_name: client.shortname || client.fullname
                        })
                        setSearchClientName(client.shortname || client.fullname)
                      }
                    }
                  }}
                  trigger={['click']}
                  open={
                    clientListCanPicked?.length > 0 && isDropdownClientsVisible
                  }
                  onOpenChange={(open) => setDropdownClientsVisible(open)}
                >
                  <Form.Item
                    label={
                      <>
                        Client Name (Company Name)&nbsp;
                        <span style={{ color: 'red' }}> (*)</span>
                      </>
                    }
                    name='client_name'
                    className='h-1-7 customize-height'
                    rules={[
                      {
                        required: true,
                        message: 'This field is required!'
                      },
                      { type: 'string' }
                    ]}
                  >
                    <StyledInput
                      placeholder='Client name'
                      onChange={(e) => {
                        setDropdownClientsVisible(true)
                        setSearchClientName(e.target.value)
                      }}
                    />
                  </Form.Item>
                </Dropdown>

                <Form.Item
                  label="Client's tag"
                  name='client_tag'
                  className='h-1-7 customize-height'
                >
                  <StyledSelect
                    maxTagCount='responsive'
                    maxTagTextLength={20}
                    mode='tags'
                    style={{ width: '100%' }}
                    placeholder='Select tags'
                    allowClear
                  >
                    {tagClient?.data?.map((item: any) => (
                      <Select.Option key={item.name} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Form.Item>

                <Form.Item
                  label='Address'
                  name='client_address'
                  className='h-1-7 customize-height'
                >
                  <StyledInput placeholder='Client address' />
                </Form.Item>

                <Form.Item
                  label='Phone Number'
                  name='phone'
                  className='h-1-7 customize-height'
                >
                  <StyledInput placeholder='Client phone number' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className='prev-next-btn-list'>
              <Col
                span={10}
                style={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <ButtonNextPreviousStyled
                  onClick={handlePreviousCard}
                  disabled={!!isAtFirstItem}
                >
                  <FiArrowLeft
                    style={{
                      color: '#666',
                      fontSize: '20px'
                    }}
                  />
                </ButtonNextPreviousStyled>
              </Col>
              <Col
                span={4}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {` ${currentCardIndex + 1} / ${sortedData?.length} `}
              </Col>
              <Col
                span={10}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <ButtonNextPreviousStyled
                  onClick={handleNextCard}
                  disabled={!!isAtLastItem}
                >
                  <FiArrowRight
                    style={{
                      color: '#666',
                      fontSize: '20px'
                    }}
                  />
                </ButtonNextPreviousStyled>
              </Col>
            </Row>

            <Row gutter={16} className='btn-list-footer'>
              <StyledButton
                onClick={() => setOpenDeleteForm(true)}
                key='cancel'
              >
                Delete
              </StyledButton>

              <StyledButton
                htmlType='submit'
                ref={btnAcceptRef}
                type='primary'
                style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
                loading={acceptLoading}
              >
                Accept
              </StyledButton>
            </Row>
          </Form>
        </FormCardDetailLayout>
      </CrmPageLayout>
      {openDeleteForm && (
        <DeleteForm
          visible={openDeleteForm}
          question='Do you want to delete this card?'
          onClose={() => setOpenDeleteForm(false)}
          onDelete={() => onDeleteThisCard(cardID || '')}
          loading={acceptLoading}
        />
      )}
    </>
  )
}

export default CardDetail
