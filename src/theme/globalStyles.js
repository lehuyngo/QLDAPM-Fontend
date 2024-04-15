import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    box-sizing: border-box;
    font-family: 'Mulish', sans-serif;



    ::-webkit-scrollbar {
      width: 7px !important;
      height: 8px !important;
      background-color: #f2f2f2;
      border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }

    
    .ant-popover{
      z-index: 999 !important;
    
      &.ant-color-picker{
        z-index: 1000 !important;

      } 
    }
  }
  

  html {
    scroll-behavior: smooth; 
  }
  .ant-picker-time-panel + .ant-picker-footer {
    display: none;
  }

  .cursor-pointer{
    cursor: pointer;
  }

  .ant-form-item-explain-error{
    font-size: 12px;
    margin-top: 4px;
  }

  //css for thread active

    .tooltip-activity-item--note{
     white-space : pre-line ;
    }
  


`

export default GlobalStyles
