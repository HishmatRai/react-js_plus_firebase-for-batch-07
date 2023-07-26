import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import {
  onSnapshot,
  getFirestore,
  doc,
  query,
  collection,
  where,
} from "firebase/firestore";
import firebase from "../../config/firebase";
import Avatar from "@mui/material/Avatar";
import moment from "moment";
const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore(firebase);
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState([]);
  const [profielImagePath, setProfileImagePath] = useState("");
  const [fullName, setFullName] = useState("");
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

          onSnapshot(doc(db, "users", user.uid), (doc) => {
            let data = doc.data();
            setFullName(data.fullName);
            setProfileImagePath(data.profileURL);
          });

          const q = query(
            collection(db, "blogs"),
            where("uid", "==", user.uid)
          );
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
  console.log(blog);
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            {blog
              .map((v, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      border: "2px solid red",
                      margin: "5px",
                      width: "250px",
                      height: "500px",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <Avatar
                        alt="Remy Sharp"
                        src={
                          profielImagePath === ""
                            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlseazoU9HMxMy6AnQyEXjboZQaAXLhWmwtV6yFvc&s"
                            : profielImagePath
                        }
                      />
                      <div>
                        <h6>{fullName}</h6>
                        <p>
                          {moment(v.created).format("MMMM Do YYYY, h:mm:ss a")}
                        </p>
                      </div>
                    </div>
                    <h1>{v.title.slice(0, 10)} {v.title.length >= 10 && "..."}</h1>
                    <p>{v.details.slice(0,200)} {v.details.length >= 200 && "..."}</p>
                    <img src={v.imagePath} height={150} width={150} />
                    <button>View</button>
                  </div>
                );
              })
              .reverse()}
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
