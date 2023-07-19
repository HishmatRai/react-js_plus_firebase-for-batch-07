import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("login true");
      } else {
        navigate("/login");
      }
    });
  }, []);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};
export default Home;
