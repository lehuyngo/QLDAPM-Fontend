import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

import {
  useCreateClient,
  useDeleteClient,
  useGetClientDetail,
  useGetClientsList,
  useUpdateClient
} from '../../api/reactQuery/Client'
import {
  useCreateClientTag,
  useDeleteClientTag
} from '../../api/reactQuery/Tag'
import DeleteForm from '../../component/deleteForm/DeleteForm'
import { NotificationCustom } from '../../component/notification/Notification'
import TagForm from '../../component/tagForm/TagForm'
import { ToolbarClient } from '../../component/toolbar/toolbarClient'
import CrmPageLayout from '../layout'
import ClientForm from './form/ClientForm'
import { TableContent } from './table'

const ClientManagement: React.FC = () => {
  const [openClientCreate, setOpenClientCreate] = useState<boolean>(false)
  const [openClientEdit, setOpenClientEdit] = useState<boolean>(false)
  const [openClientDelete, setOpenClientDelete] = useState<boolean>(false)
  const [openCreateTag, setOpenCreateTag] = useState<boolean>(false)
  const [uuidSelected, setUuidSelected] = useState<string | null>(null)
  const [openDeleteTag, setOpenDeleteTag] = useState<boolean>(false)
  const [tagSelected, setTagSelected] = useState<string | null>(null)
  const [resetForm, setResetForm] = useState<boolean>(false)

  // console.log('uuidSelected', uuidSelected)

  //toolbar
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filterByCode, setFilterByCode] = useState<boolean | null>(null)

  const { data: ClientsList, isLoading } = useGetClientsList()
  const { data: clientData } = useGetClientDetail(uuidSelected)

  const queryClient = useQueryClient()

  const { mutate: mutateCreate } = useMutation({ mutationFn: useCreateClient })
  const { mutate: mutateDelete } = useMutation({ mutationFn: useDeleteClient })
  const { mutate: mutateUpdate } = useMutation({ mutationFn: useUpdateClient })
  const { mutate: mutateCreateTag } = useMutation({
    mutationFn: useCreateClientTag
  })
  const { mutate: mutateDeleteTag } = useMutation({
    mutationFn: useDeleteClientTag
  })

  const handleDelete = (uuidSelected: string, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateDelete(uuidSelected, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientActivities'] })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The client has been deleted successfully!'
        })
        onChangeLoading(false)
        setOpenClientDelete(false)
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

  const handleUpdate = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateUpdate(data, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientDetail'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientActivities'] })
        NotificationCustom({
          type: 'success',
          message: 'Update success',
          description: 'The client has been updated successfully!'
        })
        onChangeLoading(false)
        setOpenClientCreate(false)
        handleResetForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Update fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data', error)
      }
    })
  }

  const handleCreate = (data: FormData, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateCreate(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientActivities'] })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The client has been created successfully!'
        })
        onChangeLoading(false)
        setOpenClientCreate(false)
        handleResetForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        onChangeLoading(false)
      }
    })
  }

  const onCreateTag = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      clientID: uuidSelected || '',
      data
    }
    mutateCreateTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientTags', 'client'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientDetail'] })
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
    })
  }

  const onDeleteTag = (uuid: string, onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      clientID: uuidSelected || '',
      uuid
    }
    mutateDeleteTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientDetail'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientTags', 'client'] })
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

  const handleResetForm = () => {
    setResetForm(true)
    setTimeout(() => {
      setResetForm(false)
    }, 200)
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

  const handleFilterByCode = React.useMemo(() => {
    return (value: string) => {
      if (value === 'all' || !value) {
        setFilterByCode(null) // Both "Has Code" and "No Code"
      } else {
        setFilterByCode(value === 'hasCode') // Convert to a boolean for "Has Code" and "No Code"
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoading && ClientsList?.data) {
      const updatedFilteredData = ClientsList.data.filter((item: any) => {
        const itemName = item.shortname || item.fullname
        const itemNameWithoutSpaces = itemName?.replace(/\s+/g, ' ')

        const matchesSearch = itemNameWithoutSpaces
          ?.toLowerCase()
          ?.includes(searchKeyword.toLowerCase())

        const matchesTags =
          !selectedTags.length ||
          selectedTags.every(
            (tag) => item?.tags?.some((t: any) => t.name === tag)
          )

        let matchesCode = true
        if (filterByCode !== null) {
          if (filterByCode === true) {
            matchesCode = !!item.code
          } else if (filterByCode === false) {
            matchesCode = !item.code
          }
        }

        return matchesSearch && matchesTags && matchesCode
      })

      setFilteredData(updatedFilteredData)
    }
  }, [ClientsList?.data, isLoading, searchKeyword, selectedTags, filterByCode])

  const handleOpenTagDelete = (tagID: string) => {
    setOpenDeleteTag(true)
    setTagSelected(tagID)
  }

  const handleCloseTagDelete = () => {
    setOpenDeleteTag(false)
    setTagSelected('')
  }

  const handleCloseModalClient = () => {
    setOpenClientCreate(false)
    setUuidSelected(null)
  }

  return (
    <>
      <CrmPageLayout>
        <ToolbarClient
          onOpenCreate={() => setOpenClientCreate(true)}
          onSearch={handleSearch}
          onTagChange={handleTagChange}
          onFilterByCode={handleFilterByCode}
        />
        <div
          style={{
            margin: '0px 12px'
          }}
        >
          <TableContent
            onOpenDeleteClient={() => setOpenClientDelete(true)}
            onOpenEditClient={() => {
              setOpenClientCreate(true)
              setOpenClientEdit(true)
            }}
            onOpenCreateTag={() => setOpenCreateTag(true)}
            onOpenDeleteTag={handleOpenTagDelete}
            onSelect={(uuid: string) => setUuidSelected(uuid)}
            tableData={filteredData}
            loading={isLoading}
          />
        </div>
      </CrmPageLayout>

      {/* Client Create */}
      {openClientCreate && (
        <ClientForm
          visible={openClientCreate}
          setVisible={handleCloseModalClient}
          onCreate={handleCreate}
          resetForm={resetForm}
          onUpdate={handleUpdate}
          clientId={openClientEdit ? uuidSelected : null}
        />
      )}

      {/* Client Edit
      {openClientEdit && (
        <ClientForm
          title='Edit Client'
          visible={openClientEdit}
          setVisible={setOpenClientEdit}
          onUpdate={handleUpdate}
          resetForm={resetForm}
        />
      )} */}

      {/* Client Delete */}
      {openClientDelete && (
        <DeleteForm
          visible={openClientDelete}
          question='Do you want to delete this client?'
          onClose={() => setOpenClientDelete(false)}
          onDelete={(onChangeLoading: any) =>
            handleDelete(uuidSelected || '', onChangeLoading)
          }
        />
      )}

      {openCreateTag && (
        <TagForm
          tagExisted={clientData?.tags}
          from='client'
          title={'Create Tag'}
          visible={openCreateTag}
          onClose={() => setOpenCreateTag(false)}
          onCreate={onCreateTag}
        />
      )}
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
    </>
  )
}

export default ClientManagement
