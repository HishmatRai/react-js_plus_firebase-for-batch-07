import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import firebase from "../../config/firebase";
const Loader = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          navigate("/home");
        } else {
          navigate("/email-verification");
        }
      } else {
        // User is signed out
        console.log("login false");
        // login
        navigate("/login");
      }
    });
  }, []);
  return (
    <div>
      <img src="https://i.gifer.com/ZZ5H.gif" />
    </div>
  );
};
export default Loader;
