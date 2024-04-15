import React from 'react'
import { FiStar } from 'react-icons/fi'

import { PointItemStyle } from '../style'
import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import TextWithTooltip from '../../../component/textWithTooltip'
import { useNavigate } from 'react-router-dom'

const PointItem: React.FC<PointItemProps> = ({ item }) => {
  const { avatar, fullname, shortname, email, point, uuid } = item

  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/contact/${uuid}`)
  }

  return (
    <PointItemStyle onClick={handleNavigate}>
      <div className='avatar'>
        <ImageWithAuth url={avatar} />
        {/* <img src={logo?.url} alt='avatar' /> */}
      </div>
      <div className='name'>
        <TextWithTooltip text={shortname || fullname} lineNumber={2} />
      </div>
      <div className='email'>{email}</div>
      <div className='point'>
        <div className='icon'>
          <FiStar />
        </div>
        <div className='label'>{point || 0}</div>
      </div>
    </PointItemStyle>
  )
}

interface PointItemProps {
  item: any
}

export default PointItem
