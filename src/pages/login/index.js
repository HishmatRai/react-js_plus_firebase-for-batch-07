import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "./../../components";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loader, setLoader] = useState(false);
  const LoginFun = () => {
    setMessageType("error");
    setLoader(true);
    if (email === "") {
      setMessage("email required");
      setLoader(false);
    } else if (password === "") {
      setMessage("password required");
      setLoader(false);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("user", user);
          setLoader(false);
          setMessageType("success");
          setMessage("success");
          if (user.emailVerified) {
            navigate("/home");
          } else {
            navigate("/email-verification");
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          setLoader(false);
          setMessageType("error");
          setMessage(errorMessage);
        });
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <Input
        title="Email Address"
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        title="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p style={{ color: messageType === "error" ? "red" : "green" }}>
        {message}
      </p>
      <Button title="Login" loader={loader} onClick={LoginFun} />
      <br />

      {/* forgot-password */}
      <Link to="/sign-up">Sign Hp</Link>     <br />
      <Link to="/forgot-password">forgot-password</Link>
    </div>
  );
};
export default Login;
