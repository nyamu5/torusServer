import gql from "graphql-tag";

export const FETCH_ACCOUNTS_QUERY = gql`
  {
    getAccounts {
      id
      name
      address
      username
      createdAt
      opportunities {
        id
        name
        amount
        stage
        createdAt
      }
    }
  }
`;
