import { Layout } from 'antd'
import { useState } from 'react'
import {
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi'

import { CrmHeader } from '../../component/header'
import MenuSideBar from '../../component/menuSidebar'

import CRMLogo from '../../resources/images/image-default.jpg'

import { CrmLayout } from '../../theme/crm.style'
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../constants/common'

const { Sider, Content } = Layout

const CrmPageLayout = ({ children }: any) => {
  const [collapse, setCollapse] = useState<boolean>(true)

  const navigate = useNavigate()

  const navigateHome = () => {
    navigate(PATH.HOME)
  }

  return (
    <CrmLayout>
      <Sider
        trigger={null}
        collapsed={collapse}
        collapsible
        className='site-layout-background sidebar'
      >
        <div
          className='Crm-sidebar-icon cursor-pointer '
          onClick={navigateHome}
        >
          {collapse ? (
            <div className='Crm-sidebar-icon--logo'>
              <img src={CRMLogo} alt='logo' />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className='Crm-sidebar-icon--logo'>
                <img src={CRMLogo} alt='logo' />
              </div>
              <span className='title-project'>CRM-SFA</span>
            </div>
          )}
        </div>
        <MenuSideBar />

        {collapse ? (
          <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
            <FiChevronsRight />
          </div>
        ) : (
          <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
            <FiChevronsLeft />
            <span className={`collapse-text ${!collapse && 'unCollapse'}`}>
              Collapse sidebar
            </span>
          </div>
        )}
      </Sider>

      {/* Main content layout */}
      <Layout className='site-layout'>
        <CrmHeader />
        <Content style={{ overflowY: 'auto' }}>{children}</Content>
      </Layout>
    </CrmLayout>
  )
}

export default CrmPageLayout
