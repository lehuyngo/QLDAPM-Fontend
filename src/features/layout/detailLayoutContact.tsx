import { Layout } from 'antd'

import { CrmHeader } from '../../component/header'
import { SiderDetailsContact } from '../../component/sidebarDetails/SiderDetailsContact'

import { DetailLayout } from '../../theme/crm.style'

const { Content } = Layout

const CrmPageDetailContactLayout = ({ children }: any) => {
  return (
    <DetailLayout>
      <SiderDetailsContact />
      <Layout className='site-layout'>
        <CrmHeader />
        <Content className='page-contain'>{children}</Content>
      </Layout>
    </DetailLayout>
  )
}

export default CrmPageDetailContactLayout
