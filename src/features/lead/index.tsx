import React, { useState } from 'react'
import { ToolbarLead } from '../../component/toolbar/toolbarLead'
import CrmPageLayout from '../layout'
import { TableContent } from './Table'
import LeadForm from './form/LeadForm'

import { useGetLeadList } from '../../api/reactQuery/Lead'

const LeadManagement = () => {
  const [isCreateLead, setIsCreateLead] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  )

  const { data: leadList, isLoading } = useGetLeadList()

  //toolbar function
  const handleSearch = React.useMemo(() => {
    return (keyword: string) => {
      setSearchKeyword(keyword)
    }
  }, [])

  const handleStatusChange = React.useMemo(() => {
    return (status: string | undefined) => {
      setSelectedStatus(status)
    }
  }, [])

  let filteredData: any[] = []

  if (!isLoading) {
    filteredData =
      leadList?.data?.filter((item: any) => {
        const itemName = item.shortname || item.fullname
        const itemNameWithoutSpaces = itemName?.replace(/\s+/g, ' ')

        const clientName = item.client?.shortname || item.client?.fullname || ''
        const clientNameWithoutSpaces = clientName?.replace(/\s+/g, ' ')

        const matchesSearch = searchKeyword
          ? itemNameWithoutSpaces
              .toLowerCase()
              .includes(searchKeyword.toLowerCase()) ||
            clientNameWithoutSpaces
              .toLowerCase()
              .includes(searchKeyword.toLowerCase())
          : true

        const matchesStatus = selectedStatus
          ? item?.project_status == selectedStatus
          : true

        return matchesSearch && matchesStatus
      }) || []
  }

  return (
    <CrmPageLayout>
      <ToolbarLead
        onOpenCreate={() => setIsCreateLead(true)}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />
      <div
        className='leads-contain'
        style={{
          display: 'flex',
          gap: '12px',
          margin: '0px 12px',
          height: 'calc(100vh - 64px - 64px - 12px)'
        }}
      >
        <TableContent leadList={filteredData} loading={isLoading} />
      </div>

      {isCreateLead && (
        <LeadForm
          visible={isCreateLead}
          title={'Create Lead'}
          onCloseModal={() => setIsCreateLead(false)}
          isCreate
        />
      )}
    </CrmPageLayout>
  )
}

export default LeadManagement
