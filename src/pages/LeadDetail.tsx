// Eternal dependencies
import React from 'react'

// Internal dependencies
import LeadDetail from '../features/lead/leadDetail'
import { LeadDetailProvider } from '../hooks/useLeadDetailContext'

const LeadDetailPage = () => {
  return (
    <LeadDetailProvider>
      <LeadDetail></LeadDetail>
    </LeadDetailProvider>
  )
}

export default LeadDetailPage
