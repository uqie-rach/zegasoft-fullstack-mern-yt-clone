import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailed, loginStart, loginSuccess } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";

import GoogleIcon from "@mui/icons-material/Google.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/signin`,
        {
          name: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      dispatch(loginSuccess(res.data));
      navigate("/random");
    } catch (err) {
      dispatch(loginFailed());
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    const fields = document.querySelectorAll(".signup-field");
    const data = {};

    Array.from(fields).forEach((field) => (data[field.name] = field.value));

    if (!data.password || !data.username || !data.email) {
      alert("All fields are required!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      alert("Invalid email address");
      return;
    }

    if (data.password.length < 5) {
      alert("Password must have minimum 5 characters!");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/api/auth/signup`, {
        name: data.username,
        email: data.email,
        password: data.password,
      });

      console.log(res.data);
      Array.from(fields).forEach((field) => (field.value = ""));

      alert(res.data.message);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInWithGoogle = async (e) => {
    dispatch(loginStart());

    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(
            "http://localhost:3000/api/auth/google",
            {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            },
            { withCredentials: true }
          )
          .then((result) => {
            dispatch(loginSuccess(result.data));
            navigate("/random");
          });
      })
      .catch((err) => dispatch(loginFailed()));
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to WTube</SubTitle>
        <Input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignIn}>Sign in</Button>
        <Title>or</Title>
        <Button
          onClick={handleSignInWithGoogle}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <GoogleIcon />
          Sign in with Google
        </Button>
        <Title>or</Title>
        <form id="form">
          <Input
            className="signup-field"
            name="username"
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="signup-field"
            name="email"
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="signup-field"
            name="password"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSignUp}>Sign up</Button>
        </form>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
