import { Spin } from 'antd'
import React, { Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { PATH } from '../constants/common'

import Home from '../pages/Home'

import NotFoundPage from '../pages/NotFoundPage'
import ContactManagementPage from '../pages/Contacts'
import CardManagementPage from '../pages/CardManagement'
import CardDetail from '../features/card/cardDetail/CardDetail'
import TaskManagementPage from '../pages/TasksPage'
import ContactDetail from '../features/contact/contactDetail'
import ClientsManagementPage from '../pages/Clients'
import ClientDetailPage from '../pages/ClientDetail'
import BatchMailManagement from '../pages/MailManagement'
import BatchMailDetail from '../features/mail/mailDetail'
import BoardMailPage from '../pages/BoardMail'
import ViewImagePage from '../pages/ViewImage'
import PointReportPage from '../pages/PointReport'
import LeadDetailPage from '../pages/LeadDetail'

const LoginPage = React.lazy(() => import('../pages/Login'))
const RegisterPage = React.lazy(() => import('../pages/Register'))

const withSuspense: any = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense
      fallback={
        <Spin style={{ position: 'absolute', top: '30%', left: '49%' }} />
      }
    >
      <Component {...props} />
    </Suspense>
  )
}

export const routes_layout: RouteObject[] = [
  {
    path: PATH.NOT_FOUND,
    element: <NotFoundPage />
  },
  {
    path: PATH.HOME,
    element: <Home />
  },
  {
    path: PATH.LOGIN,
    element: withSuspense(LoginPage)()
  },
  {
    path: PATH.REGISTER,
    element: withSuspense(RegisterPage)()
  },
  {
    path: PATH.CONTACT,
    element: <ContactManagementPage />
  },
  {
    path: PATH.CARD,
    element: <CardManagementPage />
  },
  {
    path: PATH.CARD_DETAIL,
    element: <CardDetail />
  },
  {
    path: PATH.TASK,
    element: <TaskManagementPage />
  },
  {
    path: PATH.TASK_DETAIL,
    element: <TaskManagementPage />
  },
  {
    path: PATH.CONTACT_DETAIL,
    element: <ContactDetail />
  },
  {
    path: PATH.CLIENT,
    element: <ClientsManagementPage />
  },
  {
    path: PATH.CLIENT_DETAIL,
    element: <ClientDetailPage />
  },
  {
    path: PATH.LEAD_DETAIL,
    element: <LeadDetailPage />
  },
  {
    path: PATH.BATCH_MAIL,
    element: <BatchMailManagement />
  },
  {
    path: PATH.BATCH_MAIL_DETAIL,
    element: <BatchMailDetail />
  },
  {
    path: PATH.BOARD_MAIL,
    element: <BoardMailPage />
  },
  {
    path: PATH.VIEW_IMAGE,
    element: <ViewImagePage />
  },
  {
    path: PATH.POINT_REPORT,
    element: <PointReportPage />
  }
]
