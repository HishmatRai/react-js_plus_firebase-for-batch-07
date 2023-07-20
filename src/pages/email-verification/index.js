import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const EmailVerification = () => {
  const auth = getAuth();
  const navigate = useNavigate();
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("login true",user);
        } else {
          navigate("/login");
        }
      });
    }, []);
  return (
    <div>
      <h1>Email Verification</h1>
    </div>
  );
};
export default EmailVerification;
