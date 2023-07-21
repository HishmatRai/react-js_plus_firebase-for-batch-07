import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
const EmailVerification = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("login true", user);
        if (user.emailVerified) {
          navigate("/home");
        }
      } else {
        navigate("/login");
      }
    });
  }, []);

  // home

  const homeHandler = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      window.location.reload();
    }, 2000);
  };

  // resend email
  const resendEmail = () => {
    setResendLoader(true);
    sendEmailVerification(auth.currentUser)
      .then(() => {
        // Email verification sent!
        // ...
        setMessage("Email verification sent!");
        setMessageType("success");
        setResendLoader(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setResendLoader(false);
        setMessageType("error");
        setMessage(errorMessage);
      });
  };
  return (
    <div>
      <h1>Email Verification</h1>
      <Button title="Home" loader={loader} onClick={homeHandler} />
      <Button
        title="Resend email"
        loader={resendLoader}
        onClick={resendEmail}
      />
      <p style={{ color: messageType === "error" ? "red" : "green" }}>
        {message}
      </p>
    </div>
  );
};
export default EmailVerification;
