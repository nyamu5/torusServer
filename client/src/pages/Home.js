import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import AccountCard from "../components/AccountCard";
import AccountForm from "../components/AccountForm";
import { FETCH_ACCOUNTS_QUERY } from "../utilities/graphql";

const Home = (props) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    props.history.push("/login");
  }
  const { loading, data: { getAccounts: accounts } = {} } = useQuery(
    FETCH_ACCOUNTS_QUERY
  );

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>My Accounts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <AccountForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Accounts...</h1>
        ) : (
          <Transition.Group>
            {accounts &&
              accounts.map((account) => (
                <Grid.Column key={account.id} style={{ marginBottom: 20 }}>
                  
                  {user && user.username === account.username && <AccountCard account={account} />}
                </Grid.Column>    
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
