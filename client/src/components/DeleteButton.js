import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utilities/graphql";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data,
        });
      }
      if (callback) callback();
    },

    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Popup
        content={commentId ? "Delete comment" : "Delete post"}
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
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(commentId: $commentId, postId: $postId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
