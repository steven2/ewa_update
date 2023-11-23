
import { gql } from "graphql-tag"

export const INSERT_CURRENCY_ONE = gql`
mutation AddCurrency ($currency: currency_insert_input!) {
  insert_currency_one(object: $currency) {
    id
    description
    currency_id
    symbol
  }
}

{
  "currency":{
  	"currency_id": 9,
  	"description": "Bitcoin", 
  	"symbol": "BTC"
}
}
`



