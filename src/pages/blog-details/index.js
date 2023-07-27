import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../components";
import { onSnapshot, getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from "../../config/firebase";
import TextField from "@mui/material/TextField";
import { Button } from "./../../components";
const BlogDetails = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore(firebase);
  const path = location.pathname.slice(14);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [edit, setEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const unsub = onSnapshot(doc(db, "blogs", path), (doc) => {
            setLoading(false);
            if (doc._document === null) {
              navigate(path);
            } else {
              let data = doc.data();
              setTitle(data.title);
              setDetails(data.details);
              setImageUrl(data.imagePath);
              setId(data.id);
            }
          });
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/login");
      }
    });
  }, []);

  // edit blog

  const EditBlog = async () => {
    setLoader(true);
    if (title === "") {
      setMessage("Title required");
      setMessageType("error");
      setLoader(false);
    } else if (details === "") {
      setMessage("Details required");
      setLoader(false);
      setMessageType("error");
    } else {
      const washingtonRef = doc(db, "blogs", path);
      await updateDoc(washingtonRef, {
        title: title,
        details: details,
      });
      setLoader(false);
      setMessage("successfully updated");
      setMessageType("success");
      setEdit(false);
    }
  };
  return (
    <div>
      <Navbar />
      <br />
      <button onClick={() => window.history.back()}>Back</button>
      {loading ? (
        <h1>Loading....</h1>
      ) : (
        <div>
          <hr />
          {edit ? (
            <div>
              <TextField
                id="outlined-multiline-flexible"
                label="Title"
                multiline
                maxRows={4}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                id="standard-multiline-static"
                label="Details"
                multiline
                rows={4}
                //   defaultValue="Default Value"
                variant="standard"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
              <p style={{ color: messageType === "error" ? "red" : "green" }}>
                {message}
              </p>
              <Button title="Update" loader={loader} onClick={EditBlog} />
            </div>
          ) : (
            <div>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button>Delete</button>
              <h1>{title}</h1>
              <p>{details}</p>
              <img src={imageUrl} width={"100%"} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default BlogDetails;
