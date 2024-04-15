// External dependencies
import React from 'react'

// Internal dependencies
import { useGetScreenHeight } from '../utils/FunctionsShare'

// StyleSheets
import { VietnameseTetThemeStyle } from './VietnameseTetTheme.style'

// Assets
import VNT_BackgroundMain from '../resources/images/VNT_BackgroundMain.png'
import VNT_PeopleBotLeft_Background from '../resources/images/VNT_PeopleBotLeft_Background.png'
import VNT_PeopleBotRight_Background from '../resources/images/VNT_PeopleBotRight_Background.png'
import VNT_Man_People_Head from '../resources/images/VNT_Man_People_Head.png'
import VNT_Man_People_Body from '../resources/images/VNT_Man_People_Body.png'
import VNT_Man_People_Body_Hand from '../resources/images/VNT_Man_People_Body_Hand.png'
import VNT_Woman_People_Head from '../resources/images/VNT_Woman_People_Head.png'
import VNT_Woman_People_Body from '../resources/images/VNT_Woman_People_Body.png'
import VNT_Woman_People_Body_Hand from '../resources/images/VNT_Woman_People_Body_Hand.png'
import VNT_FoodCenter from '../resources/images/VNT_FoodCenter.png'
import VNT_TreeLeft from '../resources/images/VNT_TreeLeft.png'
import VNT_TreeRight from '../resources/images/VNT_TreeRight.png'
import VNT_Board_Text_Right from '../resources/images/VNT_Board_Text_Right.png'
import VNT_Board_Text_Left from '../resources/images/VNT_Board_Text_Left.png'
import VNT_Lampion from '../resources/images/VNT_Lampion.png'
import VNT_Yellow_Apricot_Flower from '../resources/images/VNT_Yellow_Apricot_Flower.png'
import VNT_Pink_Apricot_Flower from '../resources/images/VNT_Pink_Apricot_Flower.png'
import VNT_TS_Cloud_Big from '../resources/images/VNT_TS_Cloud_Big.png'
import VNT_TS_Cloud_Small from '../resources/images/VNT_TS_Cloud_Small.png'
import VNT_TS_Dragon from '../resources/images/VNT_TS_Dragon.png'
import VNT_TS_Two_Number from '../resources/images/VNT_TS_Two_Number.png'
import VNT_TS_Zero_Number from '../resources/images/VNT_TS_Zero_Number.png'
import VNT_TS_Four_Number from '../resources/images/VNT_TS_Four_Number.png'

const VietnameseTetTheme: React.FC<VietnameseTetThemeProps> = ({
  children,
  className
}) => {
  // State logic

  // Ref

  // Variables

  // Custom hooks
  const screenHeight = useGetScreenHeight()

  // Higher-order functions

  // Component life-cycle methods (useEffect)

  // Component render
  return (
    <VietnameseTetThemeStyle $sh={screenHeight || 1} className={className}>
      <div
        className='background-main'
        style={{ backgroundImage: `url(${VNT_BackgroundMain})` }}
      ></div>
      <div className='set-item'>
        <div
          className='people-bot-left'
          style={{ backgroundImage: `url(${VNT_PeopleBotLeft_Background})` }}
        >
          <div className='people'>
            <div
              className='people-head'
              style={{ backgroundImage: `url(${VNT_Woman_People_Head})` }}
            ></div>
            <div
              className='people-body'
              style={{ backgroundImage: `url(${VNT_Woman_People_Body})` }}
            >
              <div
                className='body-hand'
                style={{
                  backgroundImage: `url(${VNT_Woman_People_Body_Hand})`
                }}
              ></div>
            </div>
          </div>
          <div
            className='flower-left'
            style={{ backgroundImage: `url(${VNT_Yellow_Apricot_Flower})` }}
          ></div>
          <div
            className='flower-right'
            style={{ backgroundImage: `url(${VNT_Yellow_Apricot_Flower})` }}
          ></div>
          <div
            className='flower-top-left'
            style={{ backgroundImage: `url(${VNT_Yellow_Apricot_Flower})` }}
          ></div>
        </div>
        <div
          className='people-bot-right'
          style={{ backgroundImage: `url(${VNT_PeopleBotRight_Background})` }}
        >
          <div className='people'>
            <div
              className='people-head'
              style={{ backgroundImage: `url(${VNT_Man_People_Head})` }}
            ></div>
            <div
              className='people-body'
              style={{ backgroundImage: `url(${VNT_Man_People_Body})` }}
            >
              <div
                className='body-hand'
                style={{
                  backgroundImage: `url(${VNT_Man_People_Body_Hand})`
                }}
              ></div>
            </div>
          </div>
          <div
            className='flower-right'
            style={{ backgroundImage: `url(${VNT_Pink_Apricot_Flower})` }}
          ></div>
          <div
            className='flower-left'
            style={{ backgroundImage: `url(${VNT_Pink_Apricot_Flower})` }}
          ></div>
          <div
            className='flower-top-right'
            style={{ backgroundImage: `url(${VNT_Pink_Apricot_Flower})` }}
          ></div>
        </div>
        <div
          className='food-center'
          style={{ backgroundImage: `url(${VNT_FoodCenter})` }}
        ></div>
        <div className='title-dragon'>
          <div
            className='cloud-small'
            style={{ backgroundImage: `url(${VNT_TS_Cloud_Small})` }}
          ></div>
          <div
            className='cloud-big'
            style={{ backgroundImage: `url(${VNT_TS_Cloud_Big})` }}
          ></div>
          <div
            className='dragon'
            style={{ backgroundImage: `url(${VNT_TS_Dragon})` }}
          ></div>
          <div
            className='number-two'
            style={{ backgroundImage: `url(${VNT_TS_Two_Number})` }}
          ></div>
          <div
            className='number-zero'
            style={{ backgroundImage: `url(${VNT_TS_Zero_Number})` }}
          ></div>
          <div
            className='number-four'
            style={{ backgroundImage: `url(${VNT_TS_Four_Number})` }}
          ></div>
        </div>
        <div className='tree-top-left'>
          <div
            className='tree'
            style={{ backgroundImage: `url(${VNT_TreeLeft})` }}
          ></div>
          <div
            className='board-text'
            style={{ backgroundImage: `url(${VNT_Board_Text_Left})` }}
          ></div>
          <div
            className='lampion'
            style={{ backgroundImage: `url(${VNT_Lampion})` }}
          ></div>
        </div>
        <div className='tree-top-right'>
          <div
            className='tree'
            style={{ backgroundImage: `url(${VNT_TreeRight})` }}
          ></div>
          <div
            className='board-text'
            style={{ backgroundImage: `url(${VNT_Board_Text_Right})` }}
          ></div>
          <div
            className='lampion'
            style={{ backgroundImage: `url(${VNT_Lampion})` }}
          ></div>
        </div>
      </div>
      <div className='form'>{children}</div>
    </VietnameseTetThemeStyle>
  )
}

// Props type declaration
interface VietnameseTetThemeProps {
  children: React.ReactNode
  className: string
}

export default VietnameseTetTheme
