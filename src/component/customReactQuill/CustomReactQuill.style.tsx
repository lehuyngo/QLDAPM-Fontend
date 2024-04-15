import ReactQuill from 'react-quill'
import styled from 'styled-components'
import 'react-quill/dist/quill.snow.css'
const CustomReactQuill = styled(ReactQuill)`
  .ql-toolbar {
    border-radius: 8px 8px 0px 0px !important;
  }
  .ql-container {
    height: 150px;
    border-radius: 0px 0px 8px 8px !important;
    background-color: #f5f5f5;
  }
`
export default CustomReactQuill
