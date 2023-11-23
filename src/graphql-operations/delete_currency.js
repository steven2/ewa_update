import { gql } from "graphql-tag"

export const DELETE_CURRENCY_ONE = gql`
  mutation deleteCurrency {
    delete_Currency2(where: {currency_id: {_eq: 3}}) {
      affected_rows
    }
  }
`