import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar, Button, Input } from "../../components";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
  doc,
} from "firebase/firestore";
import firebase from "../../config/firebase";
const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore(firebase);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          //
          const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            setLoader(false);
            console.log("Current data: ", doc.data());
            let data = doc.data();
            setFullName(data.fullName);
            setUserName(data.userName);
            setMobileNumber(data.mobileNumber);
            setGender(data.gender);
            setEmail(data.email);
          });
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/login");
      }
    });
  }, []);
  return (
    <div>
      <Navbar />
      {loader ? (
        <h1>Loading....</h1>
      ) : (
        <div>
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
            <option value="Male" selected={gender === "Male" && true}>
              Male
            </option>
            <option value="Female" selected={gender === "Female" && true}>Female</option>
          </select>

          <Input
            title="Email Address"
            type="email"
            placeholder="Enter email address"
            value={email}
            disabled={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p style={{ color: messageType === "error" ? "red" : "green" }}>
            {message}
          </p>
          <Button title="Update" loader={loader} />
        </div>
      )}
    </div>
  );
};
export default Profile;
