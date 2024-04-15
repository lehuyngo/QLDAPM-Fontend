import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { ToolbarContact } from '../../component/toolbar/toolbarContact'
import CrmPageLayout from '../layout'
import { TableContent } from './table'

import {
  useDeleteContact,
  useGetContactDetail,
  useGetContactsList
} from '../../api/reactQuery/Contact'
import {
  useCreateContactTag,
  useDeleteContactTag
} from '../../api/reactQuery/Tag'
import DeleteForm from '../../component/deleteForm/DeleteForm'
import { NotificationCustom } from '../../component/notification/Notification'
import TagForm from '../../component/tagForm/TagForm'
import { useContactService } from '../service/ServiceContact'
import CreateContact from './contactForm/CreateContact'
import CreateBatchEmail from './mailForm/CreateBatchEmail'

const ContactManagement: React.FC = () => {
  const [openMCreateContact, setOpenMCreateContact] = useState<boolean>(false)
  const [openMEditContact, setOpenMEditContact] = useState<boolean>(false)
  const [openMDeleteContact, setOpenMDeleteContact] = useState<boolean>(false)
  const [openCreateTag, setOpenCreateTag] = useState<boolean>(false)
  const [uuidSelected, setUuidSelected] = useState<string | null>(null)
  const [openDeleteTag, setOpenDeleteTag] = useState<boolean>(false)
  const [tagSelected, setTagSelected] = useState<string | null>(null)
  const [resetForm, setResetForm] = useState<boolean>(false)
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)

  // Send email multi user
  const [selectedUserList, setSelectedUserList] = useState<any[]>([])
  const [openMCreateBatchEmail, setOpenMCreateBatchEmail] =
    useState<boolean>(false)

  const handleChangeSelectMultiUser = (data: any[]) => {
    setSelectedUserList(data)
  }

  const handleCancelCreateBatchEmail = () => {
    setOpenMCreateBatchEmail(false)
  }
  const handleOpenCreateBatchEmail = () => {
    setOpenMCreateBatchEmail(true)
  }

  //toolbar
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: contactsList, isLoading } = useGetContactsList()
  const { data: contactData, isLoading: contactLoading } =
    useGetContactDetail(uuidSelected)

  const queryClient = useQueryClient()

  const { mutate: mutateCreateTag } = useMutation({
    mutationFn: useCreateContactTag
  })

  const { mutate: mutateDelete } = useMutation({ mutationFn: useDeleteContact })
  const { mutate: mutateDeleteTag } = useMutation({
    mutationFn: useDeleteContactTag
  })

  const contactService = useContactService()

  const handleFromLoading = (loading?: boolean | null) => {
    setIsFormLoading(!!loading)
  }

  const handleCreateContact = (data: FormData) => {
    handleFromLoading(true)

    contactService.createContact({
      data,
      handleFromLoading,
      onClose: handleCloseModal,
      handleResetForm
    })
  }

  const handleUpdate = (data: any) => {
    handleFromLoading(true)

    contactService.updateContact({
      data,
      handleFromLoading,
      onClose: handleCloseModal,
      handleResetForm
    })
  }

  const handleDelete = (uuidSelected: string, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateDelete(uuidSelected, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ['GetContactsList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactDetail', uuidSelected]
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The contact has been deleted successfully!'
        })
        onChangeLoading(false)
        setOpenMDeleteContact(false)
      },
      onError(error) {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
      }
    })
  }

  const handleCloseModal = () => {
    setOpenMCreateContact(false)
    setOpenMEditContact(false)
    setOpenMDeleteContact(false)
  }
  const handleOpenCreateContact = () => {
    setOpenMCreateContact(true)
  }

  const handleOpenEditContact = () => {
    setOpenMEditContact(true)
    setOpenMCreateContact(true)
  }

  const handleOpenDeleteContact = () => {
    setOpenMDeleteContact(true)
  }

  const onCreateTag = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    let contactID = uuidSelected ? uuidSelected : ''

    // tagService.onCreateTag()
    mutateCreateTag(
      { contactID, data },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['GetClientTags', 'contact']
          })
          queryClient.invalidateQueries({
            queryKey: ['GetContactDetail']
          })
          queryClient.invalidateQueries({
            queryKey: ['GetContactsList']
          })
          NotificationCustom({
            type: 'success',
            message: 'Create success',
            description: 'The tag has been created successfully!'
          })
          onChangeLoading(false)
          setOpenCreateTag(false)
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Create fail',
            description: error.message
          })
          onChangeLoading(false)
          console.error('Error posting data')
        }
      }
    )
  }

  const onDeleteTag = (uuid: string, onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      contactID: uuidSelected || '',
      uuid
    }
    mutateDeleteTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetContactsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetContactDetail'] })
        queryClient.invalidateQueries({
          queryKey: ['GetClientTags', 'contact']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The tag has been deleted successfully!'
        })
        onChangeLoading(false)
        setOpenDeleteTag(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }

  const handleOpenTagDelete = (tagID: string) => {
    setOpenDeleteTag(true)
    setTagSelected(tagID)
  }

  const handleCloseTagDelete = () => {
    setOpenDeleteTag(false)
    setTagSelected('')
  }

  //toolbar function
  const handleSearch = React.useMemo(() => {
    return (keyword: string) => {
      setSearchKeyword(keyword)
    }
  }, [])

  const handleTagChange = React.useMemo(() => {
    return (tags: string[]) => {
      setSelectedTags(tags)
    }
  }, [])

  let filteredData: any = !isLoading && contactsList?.data

  filteredData = contactsList?.data?.filter((item: any) => {
    const itemName = item.shortname || item.fullname
    const itemNameWithoutSpaces = itemName?.replace(/\s+/g, ' ')
    const matchesSearch = itemNameWithoutSpaces
      ?.toLowerCase()
      ?.includes(searchKeyword.toLowerCase())

    let matchesTags =
      !selectedTags.length ||
      selectedTags.every((tag) => item?.tags?.some((t: any) => t.name === tag))

    return matchesSearch && matchesTags
  })

  const handleResetForm = () => {
    setResetForm(true)
    setTimeout(() => {
      setResetForm(false)
    }, 400)
  }

  return (
    <>
      <CrmPageLayout>
        <ToolbarContact
          onOpenCreateContact={handleOpenCreateContact}
          onOpenCreateBatchEmail={handleOpenCreateBatchEmail}
          onSearch={handleSearch}
          onTagChange={handleTagChange}
        />
        <div
          style={{
            margin: '0px 12px'
          }}
        >
          <TableContent
            onOpenEditContact={handleOpenEditContact}
            onOpenDeleteContact={handleOpenDeleteContact}
            onOpenCreateTag={() => setOpenCreateTag(true)}
            onOpenDeleteTag={handleOpenTagDelete}
            onSelect={(uuid: string) => setUuidSelected(uuid)}
            tableData={filteredData}
            loading={isLoading}
            onSelectedMultiUser={handleChangeSelectMultiUser}
          />
        </div>
      </CrmPageLayout>
      {/* Modal Region*/}

      {/* Create Contact */}
      {openMCreateContact && (
        <CreateContact
          visible={openMCreateContact}
          onClose={handleCloseModal}
          loading={isFormLoading}
          loadingData={contactLoading}
          resetForm={resetForm}
          onCreate={handleCreateContact}
          onUpdate={handleUpdate}
          contactId={openMEditContact ? uuidSelected : null}
        />
      )}

      {/* Edit Contact */}
      {/* {openMEditContact && (
        <CreateContact
          visible={openMEditContact}
          onClose={handleCloseModal}
          oldData={contactData}
          onUpdate={handleUpdate}
          resetForm={resetForm}
          loading={isFormLoading}
        />
      )} */}

      {/* Delete Contact */}
      {openMDeleteContact && (
        <DeleteForm
          question='Do you want to delete this contact?'
          onDelete={(onChangeLoading) =>
            handleDelete(uuidSelected || '', onChangeLoading)
          }
          visible={openMDeleteContact}
          onClose={handleCloseModal}
        />
      )}

      {/* Tag Create */}
      {openCreateTag && (
        <TagForm
          tagExisted={contactData?.tags}
          from='contact'
          title={'Create Tag'}
          visible={openCreateTag}
          onClose={() => setOpenCreateTag(false)}
          onCreate={onCreateTag}
        />
      )}

      {/* Delete Tag */}
      {openDeleteTag && (
        <DeleteForm
          title='Delete Tag'
          question='Do you want to delete this tag?'
          onDelete={(onChangeLoading: any) =>
            onDeleteTag(tagSelected || '', onChangeLoading)
          }
          visible={openDeleteTag}
          onClose={handleCloseTagDelete}
        />
      )}

      {/* Create Email */}
      {openMCreateBatchEmail && (
        <CreateBatchEmail
          selectedUserList={contactsList?.data?.filter(
            (item: any) =>
              selectedUserList?.some((uuid: any) => uuid === item.uuid)
          )}
          open={openMCreateBatchEmail}
          onCloseModal={handleCancelCreateBatchEmail}
        />
      )}
    </>
  )
}

export default ContactManagement
