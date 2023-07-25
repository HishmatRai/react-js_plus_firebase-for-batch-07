import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import { collection, query, where, onSnapshot ,getFirestore} from "firebase/firestore";

import firebase from "../../config/firebase";
const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore(firebase);
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          // login true
          // const q = query(collection(db, "blogs"));
          // const querySnapshot = await getDocs(q);
          // setLoading(false);
          // let newBlog = [];
          // querySnapshot.forEach((doc) => {
          //   newBlog.push(doc.data());
          //   setBlog([...newBlog]);
          // });
          const q = query(collection(db, "blogs"),where("uid", "==", user.uid));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setLoading(false);
            let newBlog = [];
            querySnapshot.forEach((doc) => {
              newBlog.push(doc.data());
              setBlog([...newBlog]);
            });
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
      {loading ? (
        <h1>Loading ....</h1>
      ) : blog.length === 0 ? (
        <h1>data not available</h1>
      ) : (
        <div>
          <h1>{blog.length}</h1>
          {blog.map((v, i) => {
            return (
              <div key={i} style={{ border: "2px solid red", margin: "5px" }}>
                <h1>{v.title}</h1>
                <p>{v.details}</p>
                <img src={v.imagePath} height={150} width={150} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Home;
