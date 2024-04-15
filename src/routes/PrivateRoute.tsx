import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LOCAL_STORAGE_ITEM, PATH } from '../constants/common'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation()

  if (!localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)) {
    return <Navigate to={PATH.LOGIN} state={{ path: location.pathname }} />
  }

  return <div>{children}</div>
}

const withPrivateRoute = (Component: any) => {
  return () => (
    <PrivateRoute>
      <Component />
    </PrivateRoute>
  )
}

export { withPrivateRoute }
