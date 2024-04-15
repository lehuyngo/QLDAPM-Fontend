import { Button, Modal, Popover, Spin } from 'antd'
import { useEffect, useState } from 'react'

import { COOKIES_ITEM, TIMEZONE } from '../../constants/common'
import { getCookieItem, setCookieTimezone } from '../../utils/handleCookie'
import {
  FlagIcon,
  ModalTimezoneContent,
  ModalTimezoneOptions,
  PopoverTimezoneStyle,
  TimezoneStyle
} from './style'

type Props = {
  $theme?: any
  className?: string
}

const Timezone: React.FC<Props> = ({ $theme, className = '' }) => {
  const [isModalTZOpen, setIsModalTZOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTz, setSelectedTz] = useState<number>(0)
  const [openTimezoneConfig, setOpenTimezoneConfig] = useState(false)

  const handleOpenTimezoneConfig = (newOpen: boolean) => {
    setOpenTimezoneConfig(newOpen)
  }

  const showModalTZ = () => {
    setIsModalTZOpen(true)
  }

  const handleOk = () => {
    setLoading(true)
    setCookieTimezone(selectedTz)
    setTimeout(() => {
      setLoading(false)
      setIsModalTZOpen(false)
      window.location.reload()
    }, 300)
  }

  const handleChangeTzFirst = (utcOffset: number) => {
    setSelectedTz(utcOffset)
  }

  const getDefaultTz = () => {
    let tz = (new Date().getTimezoneOffset() * -1) / 60
    if ([7, 9].includes(tz)) {
      setSelectedTz(tz)
    }
  }

  const handleChangeTz = (utcOffset: number) => {
    setLoading(true)
    setCookieTimezone(utcOffset)
    setSelectedTz(utcOffset)
    setTimeout(() => {
      setLoading(false)
      setOpenTimezoneConfig(false)
      window.location.reload()
    }, 300)
  }

  useEffect(() => {
    let timezone: any =
      getCookieItem(COOKIES_ITEM.TIMEZONE) ||
      localStorage.getItem('crm.timezone')

    if (!timezone) {
      getDefaultTz()
      showModalTZ()
    } else {
      setCookieTimezone(timezone)
      setSelectedTz(+timezone)
      setIsModalTZOpen(false)
    }
  }, [])

  return (
    <>
      <Modal
        title='Please pick timezone!'
        open={isModalTZOpen}
        closeIcon={null}
        width='18rem'
        footer={[
          <Button
            disabled={!selectedTz}
            key='submit'
            type='primary'
            loading={loading}
            onClick={handleOk}
          >
            OK
          </Button>
        ]}
      >
        <ModalTimezoneContent>
          {TIMEZONE.map((tz) => (
            <ModalTimezoneOptions
              key={tz.utcOffset}
              $isSelected={tz.utcOffset === +selectedTz}
              onClick={() => handleChangeTzFirst(tz.utcOffset)}
            >
              <FlagIcon className='flag-icon-opt' $src={tz.icon} />
              <div>{tz.name + ' ' + tz.gmt}</div>
            </ModalTimezoneOptions>
          ))}
        </ModalTimezoneContent>
      </Modal>
      <Popover
        content={
          <PopoverTimezoneStyle
            className={`popup-tz${className ? '-' + className : ''}`}
          >
            <div className='options'>
              {TIMEZONE.filter((tz) => tz.utcOffset !== selectedTz).map(
                (tz) => (
                  <div
                    className='config-option'
                    onClick={() => {
                      handleChangeTz(tz.utcOffset)
                    }}
                    key={tz.utcOffset}
                  >
                    <FlagIcon className='flag-icon-opt' $src={tz.icon} />
                    <div>{tz.name}</div>
                    <div>{tz.gmt}</div>
                  </div>
                )
              )}
            </div>
          </PopoverTimezoneStyle>
        }
        trigger='click'
        placement='bottomRight'
        open={openTimezoneConfig}
        arrow={false}
        onOpenChange={handleOpenTimezoneConfig}
      >
        <TimezoneStyle $theme={$theme} className={className}>
          {loading ? (
            <Spin></Spin>
          ) : (
            <>
              {TIMEZONE.filter((tz) => tz.utcOffset === selectedTz).map(
                (tz) => (
                  <div className='timezone-picked' key={tz.utcOffset}>
                    <FlagIcon className='flag-icon-opt' $src={tz.icon} />
                    {tz.gmt}
                  </div>
                )
              )}
            </>
          )}
          <div className='change-time-zone-text'>Change Timezone</div>
        </TimezoneStyle>
      </Popover>
    </>
  )
}

export default Timezone
