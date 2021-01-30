import React, { useContext } from "react";
import { Button, Card, Image, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import DeleteButton from "./DeleteButton";

function AccountCard({
  account: { name, createdAt, id, username, address },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{name}</Card.Header>
        <Card.Meta as={Link} to={`/accounts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>Address: {address}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        

        <Popup
          content="create new opportunity"
          inverted
          trigger={
            <Button
              basic 
              as={Link}
              to={`/accounts/${id}`}
              color="blue"
              content="opportunity"
              icon="lightbulb outline"
              label={{
                basic: true,
                color: "blue",
                pointing: "left",
                content: "4",
              }}
            />
          }
        />

        {user && user.username === username && <DeleteButton accountId={id} />}
      </Card.Content>
    </Card>
  );
}

export default AccountCard;
