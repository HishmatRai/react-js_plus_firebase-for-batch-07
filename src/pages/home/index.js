import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
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
     <Navbar />
    </div>
  );
};
export default Home;
