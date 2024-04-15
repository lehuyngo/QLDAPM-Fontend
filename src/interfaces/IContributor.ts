import { IContact } from './IContact'
import { IUser } from './IUser'

interface IContributor {
  uuid: string
  user: IUser
  contact: IContact
}

export type { IContributor }
