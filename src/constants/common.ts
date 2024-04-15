import VNFlag from '../resources/images/VietnameseFlag.svg'
import JPFlag from '../resources/images/JapaneseFlag.svg'

const COOKIE_TOKEN = process.env.REACT_APP_COOKIE_TOKEN_KEY

export const PATH = Object.freeze({
  NOT_FOUND: '*',
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  LEAD: '/leads',
  LEAD_DETAIL: 'lead/:leadID',
  TASK: '/tasks',
  TASK_DETAIL: '/tasks/:taskId?',
  CONTACT: '/contacts',
  CONTACT_DETAIL: '/contact/:contactID',
  CARD: '/cards',
  CARD_DETAIL: '/card/:cardID',
  CLIENT: '/clients',
  CLIENT_DETAIL: '/client/:clientID',
  BATCH_MAIL: '/mails',
  BATCH_MAIL_DETAIL: '/mail/:mailID',
  BOARD_MAIL: '/mail_board',
  VIEW_IMAGE: '/view_image/:fileID/:fileName',
  POINT_REPORT: '/point_report'
})

export const LOCAL_STORAGE_ITEM = Object.freeze({
  TOKEN: 'crm_token',
  COLOR_TAG: 'color_tag',
  DRAFT_MEETING_NOTE: 'crm_draft_meeting_note'
})

export const SESSION_STORAGE_ITEM = Object.freeze({
  MODE_VIEW_TASK: 'task_view',
  CONTACT_DETAIL_TAG: 'contact_detail_tag',
  CLIENT_DETAIL_TAG: 'client_detail_tag'
})

export const COOKIES_ITEM = Object.freeze({
  TOKEN: COOKIE_TOKEN || 'skyACETokenProd',
  TIMEZONE: 'tgl.timezone'
})

export const TIMEZONE = Object.freeze([
  {
    icon: VNFlag,
    name: 'Vietnamese',
    utcOffset: 7,
    gmt: '(GMT+07:00)'
  },
  {
    icon: JPFlag,
    name: 'Japanese',
    utcOffset: 9,
    gmt: '(GMT+09:00)'
  }
])

export const TAG_PAGE = Object.freeze({
  client: 'client-tags',
  contact: 'contact-tags'
})

export const GENDER = Object.freeze({
  '1': 'Female',
  '2': 'Male',
  '3': 'Other'
})

export const DETAIL_PAGE_TYPE = {
  CLIENT: 'client',
  CONTACT: 'contact'
}

export const ALLOW_FILE = {
  IMAGE: ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.img', '.IMG'],
  PDF: ['.pdf', '.PDF'],
  EXCEL: ['.xlsx', '.XLSX', '.xls', '.XLS'],
  WORD: ['.doc', '.DOC', '.docx', '.DOCX'],
  VIDEO: ['.mp4', '.MP4', '.mov', '.MOV', '.avi', '.AVI', '.mkv', '.MKV']
}

export const TAGS_RANDOM_COLOR = [
  '#FFD88D',
  '#C9BDFF',
  '#FFBC99',
  '#B5E4CA',
  '#DF8C96',
  '#D1EEEC',
  '#F6DDE1',
  '#AAD1FF',
  '#FFEBD0'
]

export const TAB_DETAIL_PAGE = {
  HISTORY: '0',
  TAG: '1',
  EMAIL: '2',
  ACTIVITIES: '3'
}

export const ACTION_ACTIVITY = ['create', 'delete', 'update']

export const ACTIVITY_TYPE_COLOR = {
  CONTACT: '#AAD1FF',
  CLIENT: '#B5E4CA',
  TAG: '#FFBC99',
  NOTE: '#FFD88D',
  LEAD: '#C9BDFF',
  MAIL: '#DF8CD5'
}

export const HIGHLIGHT_NOTE = {
  CLASS: 'highlight-meeting-note',
  BACKGROUND_COLOR: '#fff1b1',
  COLOR: '#000000',
  FONT_WEIGHT: 'bold',
  STYLE_MAIN: 'color: rgb(0, 0, 0); background-color: rgb(255, 241, 177);',
  STYLE_SUB: 'background-color: rgb(255, 241, 177); color: rgb(0, 0, 0);',
  PREFIX:
    '<strong style="color: rgb(0, 0, 0); background-color: rgb(255, 241, 177);">',
  SUFFIX: '</strong>'
}

export const IMAGE_NOTE = {
  CLASS: 'image-meeting-note',
  DATA_FILE_ID: 'data-file-id',
  DATA_FILE_NAME: 'data-file-name',
  STYLE:
    'color: #3b5bd5; text-decoration: underline; cursor: pointer; font-weight: 600;'
}

export const HEIGHT_LIST_MEETING_NOTE: { [key: string]: number } = {
  H1: 44,
  H2: 33,
  H3: 25.74,
  H4: 22,
  H5: 18.26,
  H6: 14.74
}

export const MEETING_NOTE_QUILL_FORMAT = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'list',
  'indent',
  'link',
  'image',
  'color',
  'background',
  'mention'
]

export const MEETING_NOTE_QUILL_MODULE_TOOLBAR_CONTAINER = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['link', 'image'],
  ['clean']
]

export const MEETING_NOTE_QUILL_MODULE_CLIPBOARD = {
  matchVisual: false,
  allowed: {
    tags: [
      'a',
      'b',
      'strong',
      'u',
      's',
      'i',
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'span'
    ],
    attributes: ['href', 'rel', 'target', 'class']
  },
  keepSelection: true,
  substituteBlockElements: true,
  magicPasteLinks: false
}

export const BATCH_MAIL_STATUS = ['failed', 'waiting', 'processing', 'sent']

export const MEETING_NOTE_QUILL_MODULE_MAGIC_URL = {
  urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)/g,
  globalRegularExpression: /(https?:\/\/|www\.)[\S]+/g
}
