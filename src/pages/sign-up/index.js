import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "./../../components";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebase from "../../config/firebase";

const SignUp = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore(firebase);
  const [fullName, setFullName] = useState("Ihunar Academy");
  const [userName, setUserName] = useState("ihunar");
  const [mobileNumber, setMobileNumber] = useState("03232323232");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("info@gmail.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loader, setLoader] = useState(false);
  // sign up function
  const SingUp = () => {
    setMessageType("error");
    setLoader(true);
    if (fullName === "") {
      setMessage("Full Name required");
      setLoader(false);
    } else if (userName === "") {
      setMessage("Username required");
      setLoader(false);
    } else if (mobileNumber === "") {
      setMessage("Mobile number required");
      setLoader(false);
    } else if (gender === "") {
      setMessage("Gender required");
      setLoader(false);
    } else if (email === "") {
      setMessage("email required");
      setLoader(false);
    } else if (password === "") {
      setMessage("password required");
      setLoader(false);
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          sendEmailVerification(auth.currentUser).then(async () => {
            await setDoc(doc(db, "users", user.uid), {
              fullName: fullName,
              userName: userName,
              mobileNumber: mobileNumber,
              gender: gender,
              email: email,
              password: password,
              profileURL: "",
            });
            setLoader(false);
            setMessageType("success");
            setMessage("success");
            navigate("/email-verification");
          });
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
      <h1>SignUp</h1>
      <Input
        title="Full Name"
        type="text"
        placeholder="Enter full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        title="Username"
        type="text"
        placeholder="Enter username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <Input
        title="Mobile Number"
        type="number"
        placeholder="Enter mobile number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />
      <select onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

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
      <Button title="Sign Up" loader={loader} onClick={SingUp} />
      <br />
      <Link to="/login">Login</Link>
    </div>
  );
};
export default SignUp;
