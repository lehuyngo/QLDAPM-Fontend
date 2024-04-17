import React, { useState, useEffect } from 'react'
import {
  FiBarChart2,
  FiBriefcase,
  FiClipboard,
  FiCreditCard,
  FiGrid,
  FiMail,
  FiStar,
  FiTable,
  FiUser
} from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'

import { PATH } from '../../constants/common'

type MenuItem = Required<MenuProps>['items'][number]

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  className?: string
): MenuItem => {
  return {
    key,
    icon,
    label,
    className
  } as MenuItem
}

const MenuSideBar = () => {
  const [selectedKey, setSelectedKey] = useState<string>('leads')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const checkPage = pathname?.split('/')

  const items: MenuProps['items'] = [
    // getItem('Dashboard', 'dashboard', <FiGrid />, 'disable-menu-item'),
    getItem('Lead Management', 'leads', <FiClipboard />),
    getItem('Client Management', 'clients', <FiBriefcase />)
  ]

  const PAGES = {
    DASHBOARD: 'dashboard',
    LEAD_DETAIL: 'leads',
    CLIENT: 'clients',
    CONTACT: 'contacts',
    TASK: 'tasks',
    CARD: 'cards',
    CARD_DETAIL: 'card',
    BATCH_MAIL: 'mails',
    BATCH_MAIL_DETAIL: 'mail',
    BOARD_MAIL: 'mail_board',
    POINT_REPORT: 'point_report'
  }
  const {
    DASHBOARD,
    LEAD_DETAIL,
    CLIENT,
    CONTACT,
    TASK,
    CARD,
    CARD_DETAIL,
    BATCH_MAIL,
    BATCH_MAIL_DETAIL,
    BOARD_MAIL,
    POINT_REPORT
  } = PAGES

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const key = e.key
    switch (key) {
      case DASHBOARD:
        navigate(`${PATH.HOME}`)
        break
      case CLIENT:
        navigate(`${PATH.CLIENT}`)
        break

      case TASK:
        navigate(`${PATH.TASK}`)
        break

      case CONTACT:
        navigate(`${PATH.CONTACT}`)
        break
      case CARD:
        navigate(`${PATH.CARD}`)
        break
      case BATCH_MAIL:
        navigate(`${PATH.BATCH_MAIL}`)
        break

      case BOARD_MAIL:
        navigate(`${PATH.BOARD_MAIL}`)
        break

      case POINT_REPORT:
        navigate(`${PATH.POINT_REPORT}`)
        break

      default:
        navigate(`${PATH.HOME}`)
        break
    }
  }

  // Update selectedKey when the route changes
  useEffect(() => {
    if (checkPage.includes(LEAD_DETAIL)) {
      setSelectedKey(LEAD_DETAIL)
    }
    if (checkPage.includes(CLIENT)) {
      setSelectedKey(CLIENT)
    }
    if (checkPage.includes(CONTACT)) {
      setSelectedKey(CONTACT)
    }
    if (checkPage.includes(TASK)) {
      setSelectedKey(TASK)
    }
    if (checkPage.includes(CARD) || checkPage.includes(CARD_DETAIL)) {
      setSelectedKey(CARD)
    }
    if (
      checkPage.includes(BATCH_MAIL) ||
      checkPage.includes(BATCH_MAIL_DETAIL)
    ) {
      setSelectedKey(BATCH_MAIL)
    }

    if (checkPage.includes(BOARD_MAIL)) {
      setSelectedKey(BOARD_MAIL)
    }
    if (checkPage.includes(POINT_REPORT)) {
      setSelectedKey(POINT_REPORT)
    }
  }, [checkPage])

  return (
    <Menu
      theme='light'
      mode='inline'
      selectedKeys={[selectedKey]}
      onClick={handleMenuClick}
      items={items}
    />
  )
}

export default MenuSideBar
