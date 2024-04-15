import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { LOCAL_STORAGE_ITEM } from './constants/common'
import { IDraftMeetingNote } from './interfaces/IMeetingNote'
import { routes_layout } from './routes'

import GlobalStyles from './theme/globalStyles'
import { checkTokenAndRedirect } from './utils/handleCookie'

const queryClient = new QueryClient()

const App: React.FC = () => {
  useEffect(() => {
    checkTokenAndRedirect()
  }, [])

  useEffect(() => {
    let creatingDraftList: IDraftMeetingNote[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE) || '[]'
    )
    creatingDraftList = creatingDraftList.filter(
      (item) => item.createdAt > dayjs().valueOf()
    )
    localStorage.setItem(
      LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE,
      JSON.stringify(creatingDraftList)
    )
  }, [])

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {routes_layout.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
        <GlobalStyles />
      </QueryClientProvider>
    </Router>
  )
}

export default App
