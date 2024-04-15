import { Layout } from 'antd'

import { CrmHeader } from '../../component/header'
import { SiderDetailsClient } from '../../component/sidebarDetails/SiderDetailsClient'

import { DetailLayout } from '../../theme/crm.style'

const { Content } = Layout

const CrmPageDetailClientLayout = ({ children }: any) => {
  return (
    <DetailLayout>
      <SiderDetailsClient />
      <Layout className='site-layout'>
        <CrmHeader />
        <Content className='page-contain'>{children}</Content>
      </Layout>
    </DetailLayout>
  )
}

export default CrmPageDetailClientLayout
