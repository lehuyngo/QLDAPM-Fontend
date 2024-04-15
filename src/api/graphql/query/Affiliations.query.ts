import { gql } from '@apollo/client'

const AFFILIATIONS_QUERY = gql`
  {
    affiliations(skip: 0, take: 100) {
      items {
        affiliationCode
        affiliationAbove
        affiliationNameFull
        createdAt
        managerCode
        updatedAt
        affiliationNameShort
      }
    }
  }
`

export { AFFILIATIONS_QUERY }
