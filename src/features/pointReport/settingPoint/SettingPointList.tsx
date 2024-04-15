import React from 'react'
import { FiClipboard, FiCreditCard, FiMail, FiStar } from 'react-icons/fi'
import Slider from 'react-slick'
import styled from 'styled-components'

import TextWithTooltip from '../../../component/textWithTooltip'
import { IPoint } from '../../../interfaces/IPoint'

const settingPointListData = [
  {
    icon: <FiMail />,
    label: 'Send Mail',
    total: 235
  },
  { icon: <FiCreditCard />, label: 'Add Card', total: 130 },
  { icon: <FiClipboard />, label: 'Meeting Note', total: 30 }
]

interface SettingPointListProps {
  data: IPoint[]
}

const SettingPointList: React.FC<SettingPointListProps> = ({ data }) => {
  const settings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  }

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props
    return <div className={className} onClick={onClick} />
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props
    return <div className={className} onClick={onClick} />
  }
  // Component life-cycle methods (useEffect)

  return (
    <SettingListPointWrapper>
      {data?.length > 0 && (
        <SliderStyled {...settings} className='setting-list-default'>
          {data.map((item) => (
            <div className='setting-item' key={item.uuid}>
              <div className='title'>
                <div className='label'>
                  <TextWithTooltip text={item.name} lineNumber={1} />
                </div>
              </div>
              <div className='total-point'>
                <div className='icon'>
                  <FiStar />
                </div>
                <div className='label'>
                  <TextWithTooltip text={`${item.point}`} lineNumber={1} />
                </div>
              </div>
            </div>
          ))}
        </SliderStyled>
      )}
    </SettingListPointWrapper>
  )
}

export default SettingPointList

const SliderStyled = styled(Slider)`
  .slick-arrow {
    &.slick-prev {
      z-index: 100;
      /* position: absolute;
      left: -8px; */

      &::before {
        color: #f98d6c;
        /* padding: 8px; */
        font-size: 24px;
      }
    }

    &.slick-next {
      z-index: 100;
      /* position: absolute;
      right: 4px; */

      &::before {
        color: #f98d6c;
        /* padding: 8px; */
        font-size: 24px;
        /* margin-right: 8px; */
      }
    }
  }

  .slick-list {
    /* margin: 0 -8px; */

    .slick-track {
      display: flex;
      gap: 8px;
      margin: 0px;
    }
  }
`
const SettingListPointWrapper = styled.div`
  padding: 0 40px;
  margin-bottom: 12px;

  .setting-item {
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 12px 24px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;

    .title {
      color: #3b5bd5;
      display: flex;
      gap: 8px;

      .icon {
        font-size: 24px;
      }
      .label {
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
      }
    }

    .total-point {
      color: #ffc700;
      display: flex;
      align-items: center;
      gap: 8px;

      .icon {
        font-size: 30px;
        display: flex;
        align-items: center;
        svg {
          fill: currentColor;
          border: 1px solid;
          padding: 4px;
          border-radius: 50rem;
        }
      }

      .label {
        font-size: 20px;
        line-height: 24px;
        font-weight: 500;
      }
    }
  }
`
