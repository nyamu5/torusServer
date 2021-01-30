import React, { useContext, useRef  } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Dimmer,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Loader,
  Popup,
  Segment,
  Transition,
} from "semantic-ui-react";
import moment from "moment";

import DeleteButton from "../components/DeleteButton";
import { AuthContext } from "../context/auth";
import { useForm } from "../utilities/hooks";


const SingleAccount = (props) => {
  const { user } = useContext(AuthContext);

 

  ////////////////////////////////////////////

    const accountId = props.match.params.accountId;

  const opportunityInputRef = useRef(null);

   const { onChange, values } = useForm(createOpportunityCallback, {
    name: "",
    stage: "",
    amount: "",
  });



  const { data: { getAccount } = {} } = useQuery(FETCH_ACCOUNT_QUERY, {
    variables: { accountId },
  });

  values.accountId = accountId;

  const [createOpportunity] = useMutation(CREATE_OPPORTUNITY, {
    update() {
      // setOpportunity("");
      opportunityInputRef.current.blur();
    },
    variables: 
      // {accountId},
      values
    ,
  });

   async function createOpportunityCallback() {
    try {
      await createOpportunity();
    } catch (e) {
      console.log("login user error", e); 
    }
  }


  ///////////////////////////////////////////



  function deleteAccountCallback() {
    props.history.push("/");
  }

  let accountMarkup;
  if (!getAccount) {
    accountMarkup = (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading Account</Loader>
        </Dimmer>
      </Segment>
    );
  } else {
    const {
      id,
      name,
      
      opportunities,
  
      createdAt,
      username,
    } = getAccount;

    accountMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{name}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <Popup
                  content="Create new opportunity"
                  inverted
                  trigger={
                    <Button as="div" labelPosition="up">
                      <Button basic color="blue">
                        <Icon name="lightbulb outline" />
                      </Button>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton accountId={id} callback={deleteAccountCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  
                  <Form>
        <h2>Create New Opportunity</h2>
        <Form.Field>
          <Form.Input
            placeholder="Enter new opportunity name"
            name="name"
            label="Name"
            value={values.name}
            onChange={onChange}
            ref={opportunityInputRef}
          />
          <Form.Input
            placeholder="Enter new opportunity stage"
            name="stage"
            label="Stage"
            value={values.stage}
            onChange={onChange}
            ref={opportunityInputRef}
          />
          <Form.Input
            placeholder="Enter new opportunity amount"
            name="amount"
            type="number"
            label="Amount"
            value={values.amount}
            onChange={onChange}
            ref={opportunityInputRef}
          />
          <Button type="submit" color="green" onClick={createOpportunity} >
            Submit
          </Button>
        </Form.Field>
      </Form>
                </Card.Content>
              </Card>
            )}
            {opportunities.map((opportunity) => (
              <Transition.Group key={opportunity.id}>
                <Card fluid key={opportunity.id}>
                  <Card.Content>
                    {/* {user && user.username === opportunity.username && (
                      // <DeleteButton accountId={id} opportunityId={opportunity.id} />
                    )}
                    <Card.Header>{opportunity.name}</Card.Header> */}
                    <Card.Header>
        <Label  size="tiny" >
           Name
        </Label> 
          {opportunity.name}
      </Card.Header>
                    <Card.Meta>{moment(opportunity.createdAt).fromNow()}</Card.Meta>
                    <Card.Description><Label  size="tiny" >
           Stage
        </Label> {opportunity.stage}</Card.Description>
                    <Card.Description><Label  size="tiny" >
           Amount($)
        </Label> {opportunity.amount} </Card.Description>
                  </Card.Content>
                </Card>
              </Transition.Group>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return accountMarkup;
};

const CREATE_OPPORTUNITY = gql`
  mutation createOpportunity($accountId: ID!, $name: String!, $amount: String!, $stage: String!) {
    createOpportunity(accountId: $accountId, name: $name, stage: $stage, amount: $amount) {
      id
      opportunities {
        id
        name
        amount
        stage
        createdAt
        username
      }
      
    }
  }
`;

const FETCH_ACCOUNT_QUERY = gql`
  query($accountId: ID!) {
    getAccount(accountId: $accountId) {
      id
      name
      address
      createdAt
      username
      opportunities {
        id
        username
        name
        amount
        stage
        createdAt
      }
    }
  }
`;

export default SingleAccount;
