import React from 'react'
import { CardItemStyle } from '../style'
import CardDefault from '../../../resources/images/name-card-default.png'
import { useNavigate } from 'react-router'
import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import TextWithTooltip from '../../../component/textWithTooltip'

interface cardItemProps {
  item?: any
}

const CardItem: React.FC<cardItemProps> = ({ item }) => {
  const navigate = useNavigate()
  return (
    <CardItemStyle>
      <div className='image-container'>
        <ImageWithAuth url={item?.name_card?.url} />
      </div>
      <div className='info-container'>
        {item?.client_name ? (
          <TextWithTooltip className='name-client' text={item.client_name} />
        ) : (
          <div className='name-client empty'></div>
        )}
        {item?.client_website ? (
          <TextWithTooltip
            className='website-client'
            text={item.client_website}
          />
        ) : (
          <div className='website-client empty'></div>
        )}
        <div className='action-container'>
          <div className='btn' onClick={() => navigate(`/card/${item?.uuid}`)}>
            Show Card
          </div>
        </div>
      </div>
    </CardItemStyle>
  )
}

export default CardItem
