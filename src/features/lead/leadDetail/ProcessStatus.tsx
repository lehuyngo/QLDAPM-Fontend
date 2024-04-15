// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spin } from 'antd'
import { useState } from 'react'

// Internal dependencies
import { useUpdateStatusLead } from '../../../api/reactQuery/Lead'
import { ModeStatusLead } from '../../../component/modePage'
import { NotificationCustom } from '../../../component/notification/Notification'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IStatusLead } from '../../../interfaces/IStatusLead'
import ChangeStatusLeadForm from '../form/ChangeStatusLeadForm'

// StyleSheets
import { ProcessStatusWrapper } from '../style'

// Assets

function ProcessStatus({ statusList, isLoading }: Props) {
  // State logic
  const [isUpdatingStatus, setUpdatingStatus] = useState<boolean>(false)
  const [isOpeningToUpdateStatus, setOpeningToUpdateStatus] = useState<{
    open: boolean
    note: string
  } | null>(null)

  // Ref

  // Variables

  // Custom hooks
  const queryClient = useQueryClient()
  const { selectedLead, handleChangeFetchAPI } = useLeadDetailContext()
  const { mutate: mutateUpdateStatusLead } = useMutation({
    mutationFn: useUpdateStatusLead
  })

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  const onEdit = (status: number) => {
    const dataSend: any = {
      project_status: status
    }
    if (status === 5) {
      setUpdatingStatus(true)
    } else {
      handleChangeFetchAPI(true)
    }
    mutateUpdateStatusLead(
      { dataUpdate: dataSend, uuid: selectedLead?.uuid },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['GetLeadList'] })
          queryClient.invalidateQueries({ queryKey: ['GetLeadDetail'] })
          setTimeout(() => {
            NotificationCustom({
              type: 'success',
              message: 'Update success',
              description: 'The lead has been updated successfully!'
            })
          }, 1000)
          if (status === 5) {
            setUpdatingStatus(false)
            setOpeningToUpdateStatus(null)
          } else {
            handleChangeFetchAPI(false)
          }
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Update fail',
            description: error.message
          })
          if (status === 5) {
            setUpdatingStatus(false)
          } else {
            handleChangeFetchAPI(false)
          }
        }
      }
    )
  }

  // Component render
  return (
    <>
      <ProcessStatusWrapper>
        {isLoading ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Spin />
          </div>
        ) : (
          <ModeStatusLead
            tabs={statusList.map((item) => ({
              value: item.value,
              label: item.name,
              note: item?.note || ''
            }))}
            tab={selectedLead?.project_status || 1}
            onChangeTab={onEdit}
            onOpenFormChange={(note: string) =>
              setOpeningToUpdateStatus({
                open: true,
                note: note
              })
            }
            disabled={selectedLead?.project_status === 5}
          />
        )}
      </ProcessStatusWrapper>
      {isOpeningToUpdateStatus && (
        <ChangeStatusLeadForm
          onChange={onEdit}
          loading={isUpdatingStatus}
          note={isOpeningToUpdateStatus.note}
          visible={isOpeningToUpdateStatus.open}
          onClose={() => setOpeningToUpdateStatus(null)}
        />
      )}
    </>
  )
}

// Props types declaration
interface Props {
  statusList: IStatusLead[]
  status: number
  isLoading: boolean
}

export default ProcessStatus
