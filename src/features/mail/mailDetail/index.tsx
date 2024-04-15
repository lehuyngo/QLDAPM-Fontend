import React, { useEffect, useState } from 'react'
import CrmPageLayout from '../../layout'
import { ToolbarMailDetail } from '../../../component/toolbar/toolbarMailDetail'
import { useParams } from 'react-router-dom'
import { useGetBatchMailDetail } from '../../../api/reactQuery/BatchMail'
import { TableDetailContent } from '../table/TableDetail'
import { Button, Modal } from 'antd'

const BatchMailDetail = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSuccessAllMail, setSuccessAllMail] = useState(false)
  const [showRefetchPrompt, setShowRefetchPrompt] = useState(false)

  const { mailID = null } = useParams<any>()
  const { data: batchMailDetailData, isLoading: batchMailDetailLoading } =
    useGetBatchMailDetail(mailID, isSuccessAllMail)

  useEffect(() => {
    if (!isSuccessAllMail) {
      const interval = setInterval(() => {
        setShowRefetchPrompt(true)
      }, 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [isSuccessAllMail])

  useEffect(() => {
    if (batchMailDetailData?.receivers?.length > 0) {
      if (
        batchMailDetailData?.receivers?.every(
          (m: any) => m?.status === 3 || m?.status === -1
        )
      ) {
        setSuccessAllMail(true)
      } else setSuccessAllMail(false)
    }
  }, [batchMailDetailData])

  let filteredData: any =
    !batchMailDetailLoading && batchMailDetailData?.receivers

  filteredData = batchMailDetailData?.receivers?.filter((item: any) => {
    const itemName = item?.contact?.fullname

    const matchesSearch =
      !searchKeyword ||
      itemName?.toLowerCase()?.includes(searchKeyword?.toLowerCase())
    return matchesSearch
  })

  const handleSearch = React.useMemo(() => {
    return (keyword: string) => {
      setSearchKeyword(keyword)
    }
  }, [])

  const stopRefetch = () => {
    setShowRefetchPrompt(false)
    setSuccessAllMail(true)
  }

  return (
    <CrmPageLayout>
      <ToolbarMailDetail onSearch={handleSearch} />
      <div
        style={{
          display: 'flex',
          gap: '16px',
          margin: '0px 12px 12px',
          background: '#f5f5f5'
        }}
      >
        <TableDetailContent
          tableData={
            filteredData?.map((m: any) => ({
              ...m,
              send_time: batchMailDetailData?.send_time
            })) || []
          }
          loading={batchMailDetailLoading}
        />
      </div>
      {showRefetchPrompt && (
        <Modal
          title='Refetch Prompt'
          open={showRefetchPrompt}
          onCancel={() => setShowRefetchPrompt(false)}
          footer={[
            <Button key='cancel' onClick={() => setShowRefetchPrompt(false)}>
              Continue
            </Button>,
            <Button key='ok' type='primary' onClick={stopRefetch}>
              Stop
            </Button>
          ]}
        >
          Do you want to continue fetching?
        </Modal>
      )}
    </CrmPageLayout>
  )
}

export default BatchMailDetail
