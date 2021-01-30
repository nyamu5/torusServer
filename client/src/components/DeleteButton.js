import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";

import { FETCH_ACCOUNTS_QUERY } from "../utilities/graphql";

const DeleteButton = ({ accountId, opportunityId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = opportunityId ? DELETE_OPPORTUNITY_MUTATION : DELETE_ACCOUNT_MUTATION;

  const [deleteAccountOrOpportunity] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!opportunityId) {
        const data = proxy.readQuery({
          query: FETCH_ACCOUNTS_QUERY,
        });
        data.getAccounts = data.getAccounts.filter((a) => a.id !== accountId);

        proxy.writeQuery({
          query: FETCH_ACCOUNTS_QUERY,
          data,
        });
      }
      if (callback) callback();
    },

    variables: {
      accountId,
      opportunityId,
    },
  });

  return (
    <>
      <Popup
        content={opportunityId ? "Delete opportunity" : "Delete account"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteAccountOrOpportunity}
      />
    </>
  );
};

const DELETE_ACCOUNT_MUTATION = gql`
  mutation deleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId)
  }
`;

const DELETE_OPPORTUNITY_MUTATION = gql`
  mutation deleteOpportunity($opportunityId: ID!, $accountId: ID!) {
    deleteOpportunity(opportunityId: $opportunityId, accountId: $accountId) {
      id
      opportunities {
        id
        username
        createdAt
        name
        stage
        amount
      }
    }
  }
`;

export default DeleteButton;
