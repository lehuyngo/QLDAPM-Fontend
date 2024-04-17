import { Spin } from 'antd'
import React, { Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { PATH } from '../constants/common'

import Home from '../pages/Home'

import NotFoundPage from '../pages/NotFoundPage'


import CardDetail from '../features/card/cardDetail/CardDetail'

import ClientsManagementPage from '../pages/Clients'
import ClientDetailPage from '../pages/ClientDetail'

import ViewImagePage from '../pages/ViewImage'
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
    path: PATH.CARD_DETAIL,
    element: <CardDetail />
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
    path: PATH.VIEW_IMAGE,
    element: <ViewImagePage />
  }
]
