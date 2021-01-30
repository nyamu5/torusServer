import React from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../utilities/hooks";
import { FETCH_ACCOUNTS_QUERY } from "../utilities/graphql";

const AccountForm = () => {
  const { values, onChange, onSubmit } = useForm(createAccountCallback, {
    name: "",
    address: "",
  });

  const [createAccount, { error }] = useMutation(CREATE_ACCOUNT, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ACCOUNTS_QUERY,
      });
      data.getAccounts = [result.data.createAccount, ...data.getAccounts];

      proxy.writeQuery({
        query: FETCH_ACCOUNTS_QUERY,
        data: {
          getAccounts: [result.data.createAccount, ...data.getAccounts],
        },
      });

      values.name = "";
      values.address = "";

      // values.body = "";
    },
  });

  async function createAccountCallback() {
    try {
      await createAccount();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create New Account</h2>
        <Form.Field>
          <Form.Input
            placeholder="Enter new account name"
            name="name"
            label="Account name"
            onChange={onChange}
            value={values.name}
            error={error ? true : false}
          />
          <Form.Input
            placeholder="Enter new account address"
            name="address"
            label="Account address"
            onChange={onChange}
            value={values.address}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>

      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_ACCOUNT = gql`
  mutation createAccount($name: String!, $address: String!) {
    createAccount(name: $name, address: $address) {
      id
      name
      address
      username
      createdAt
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

export default AccountForm;
