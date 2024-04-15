import { gql } from '@apollo/client'

export const CREATE_AWARD = gql`
  mutation createAward(
    $awardName: String!
    $tglCode: String!
    $issueDate: String
    $issuer: String
  ) {
    addAwardToUser(
      awardInput: {
        awardName: $awardName
        tglCode: $tglCode
        issueDate: $issueDate
        issuer: $issuer
      }
    ) {
      awardGuid
    }
  }
`
