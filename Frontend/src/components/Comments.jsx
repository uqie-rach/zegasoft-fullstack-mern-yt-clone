import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import SendCommentIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import axios from "axios";

const Container = styled.div``;

const NewComment = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  flex: 1;
`;

const PostButton = styled.button`
  max-width: 126px;
  height: 35px;
  font-weight: 500;
  background: none;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [sentComment, setSentComment] = useState(false);

  const handleSendComment = async (e) => {
    e.preventDefault();
    let input = document.querySelector("#desc-field").value;
    let form = document.querySelector("#form");

    try {
      if (!input) alert("Comment cannot empty!");
      else {
        await axios.post(
          `http://localhost:3000/api/comments/${videoId}`,
          { desc: input },
          {
            withCredentials: true,
          }
        );

        setSentComment(true);
      }
    } catch (error) {
      alert(error);
    } finally { 
      form.reset();
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/comments/${videoId}`
        );

        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [videoId, sentComment]);

  return (
    <Container>
      <NewComment id="form">
        <Avatar src={currentUser.img} />
        <Input placeholder="Add a comment..." id="desc-field"/>
        <PostButton onClick={handleSendComment}>
          <SendCommentIcon style={{ color: "white" }} />
        </PostButton>
      </NewComment>

      {comments &&
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
    </Container>
  );
};

export default Comments;
