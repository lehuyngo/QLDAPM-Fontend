import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  useCreateContact,
  useDeleteContact,
  useUpdateContact
} from '../../api/reactQuery/Contact'
import { NotificationCustom } from '../../component/notification/Notification'

interface serviceProps {
  uuid?: string | null
  data?: any
  handleFromLoading: () => void
  onClose: () => void
  handleResetForm?: () => void
}

export const useContactService = () => {
  const queryClient = useQueryClient()
  const { mutate: mutateCreate } = useMutation({
    mutationFn: useCreateContact
  })
  const { mutate: mutateDelete } = useMutation({
    mutationFn: useDeleteContact
  })
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: useUpdateContact
  })

  const createContact = ({
    data,
    handleFromLoading,
    onClose,
    handleResetForm
  }: serviceProps) => {
    mutateCreate(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetContactsList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The contact has been created successfully!'
        })

        handleFromLoading()
        onClose()
        handleResetForm && handleResetForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        handleFromLoading()
      }
    })
  }

  const deleteContact = ({
    uuid = null,
    onClose,
    handleFromLoading
  }: serviceProps) => {
    mutateDelete(uuid, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ['GetContactsList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The contact has been deleted successfully!'
        })

        handleFromLoading()
        onClose()
      },
      onError(error) {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        handleFromLoading()
      }
    })
  }

  const updateContact = ({
    data,
    handleFromLoading,
    onClose,
    handleResetForm
  }: serviceProps) => {
    mutateUpdate(data, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ['GetContactsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Update success',
          description: 'The contact has been updated successfully!'
        })

        handleFromLoading()
        onClose()
        handleResetForm && handleResetForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Update fail',
          description: error.message
        })

        handleFromLoading()

        console.error('Error posting data', error)
      }
    })
  }

  return {
    createContact,
    deleteContact,
    updateContact
  }
}
