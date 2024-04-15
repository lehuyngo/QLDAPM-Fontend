export interface IPoint {
  name: string
  point: number
  uuid: string
}

export interface IContactPoint {
  uuid: string
  fullname: string
  shortname?: string
  email: string
  point: number
}
