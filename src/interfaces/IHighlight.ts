interface IHighlight {
  uuid: string
  title: string
  created_at: number
  meeting_note_uuid: string
  creator_uuid: string
  position_uuid: string
}

interface IHighlightCreate {
  title: string
  position_uuid: string
}

interface ISelectedText {
  selectedText: string
  rangeCount: number
  range: any
  headNodeSelected?: any
  tailNodeSelected?: any
}

export type { IHighlight, IHighlightCreate, ISelectedText }
