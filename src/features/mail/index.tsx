import React, { useEffect, useState } from 'react'
import CrmPageLayout from '../layout'
import { TableContent } from './table'
import { ToolbarMail } from '../../component/toolbar/toolbarMail'
import { useGetBatchMailList } from '../../api/reactQuery/BatchMail'
import { Button, Modal } from 'antd'

const BatchMail = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isRefetch, setIsRefetch] = useState(false)
  const [showRefetchPrompt, setShowRefetchPrompt] = useState(false)

  const { data: batchMailData, isLoading: batchMailLoading } =
    useGetBatchMailList(isRefetch)

  useEffect(() => {
    if (!isRefetch) {
      const interval = setInterval(() => {
        setShowRefetchPrompt(true)
      }, 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [isRefetch])

  useEffect(() => {
    if (batchMailData?.data?.length > 0) {
      if (
        batchMailData?.data?.every(
          (m: any) => m?.status === 3 || m?.status === -1
        )
      ) {
        setIsRefetch(true)
      } else setIsRefetch(false)
    }
  }, [batchMailData])

  let filteredData: any = !batchMailLoading && batchMailData?.data

  filteredData = batchMailData?.data?.filter((item: any) => {
    const itemName = item?.sender?.displayname?.replace(/\s+/g, ' ')

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
    setIsRefetch(true)
  }

  return (
    <CrmPageLayout>
      <ToolbarMail onSearch={handleSearch} />
      <div
        style={{
          margin: '0px 12px'
        }}
      >
        <TableContent tableData={filteredData} loading={batchMailLoading} />
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

export default BatchMail
