import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  useCreateContact,
  useDeleteContact,
  useUpdateContact
} from '../../api/reactQuery/Contact'
import { NotificationCustom } from '../../component/notification/Notification'
import { useCreateContactTag } from '../../api/reactQuery/Tag'

interface serviceProps {
  linkId?: string | null
  data?: any
  onChangeLoading: (loading: boolean) => void
  onClose: () => void
  handleResetForm?: () => void
}

export const useTagService = () => {
  const queryClient = useQueryClient()

  const { mutate: mutateCreateTag } = useMutation({
    mutationFn: useCreateContactTag
  })

  const onCreateTag = (
    data: any,
    contactID: string,
    onClose: () => void,
    onChangeLoading: any
  ) => {
    onChangeLoading(true)

    mutateCreateTag(
      { contactID, data },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['GetContactTags']
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
          onClose()
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

  return {
    onCreateTag
  }
}
