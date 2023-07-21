import React,{useState} from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Input,Button } from "./../../components";
const ForgotPassword = () => {
    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loader, setLoader] = useState(false);

//     sendPasswordResetEmail(auth, email)
//   .then(() => {
//     // Password reset email sent!
//     // ..
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

const ResendPassword = () => {
    setLoader(true);
    if (email === "") {
      setMessage("email required");
      setLoader(false);
      setMessageType("error");
    }  else {
        sendPasswordResetEmail(auth, email)
        .then(() => {
          setLoader(false);
          setMessageType("success");
          setMessage("Password reset email sent!");
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
      <h1>Forgot Password</h1>
      <Input
        title="Email Address"
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p style={{ color: messageType === "error" ? "red" : "green" }}>
        {message}
      </p>
      <Button title="resend email" loader={loader} onClick={ResendPassword} />
    </div>
  );
};
export default ForgotPassword;
