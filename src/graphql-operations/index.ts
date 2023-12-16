import { gql } from "graphql-tag"

export const INSERT_CURRENCY_ONE = gql`
    mutation AddCurrency($currency_id: Int!, $description: String!, $symbol: String!)  {
        insert_Currency2_one(object: {
            currency_id: $currency_id, 
            description: $description, 
            symbol: $symbol}) {
                currency_id
                description
                symbol
            }
    }

`

export const UPDATE_CURRENCY_BY_PK = gql`
    mutation update_Currency2 ($currency_id: Int!, $description: String!, $symbol: String!) {
        update_Currency2_by_pk(pk_columns: {currency_id: $currency_id}, 
                                     _set: {description: $description, symbol: $symbol}) {
            description
            symbol
            currency_id
        }
    }
`

export const DELETE_CURRENCY_BY_PK = gql`
    mutation delete_Currency2_by_pk($currency_id: Int!) {
        delete_Currency2_by_pk(currency_id: $currency_id) {
            currency_id
            description
            symbol
        }
    }
`

export const SELECT_CURRENCIES = gql`
    query select_currencies {
    Currency2 {
        currency_id
        description
        symbol
    }
    }
`

