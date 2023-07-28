import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../components";
import { onSnapshot, getFirestore, doc, updateDoc,deleteDoc  } from "firebase/firestore";
import firebase from "../../config/firebase";
import TextField from "@mui/material/TextField";
import { Button } from "./../../components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject 
} from "firebase/storage";
import swal from 'sweetalert';

const BlogDetails = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const storage = getStorage();
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
  const [imageUid, setImageUid] = useState("");
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
              setImageUid(data.imageUid);
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

  // upload file
  const UploadFile = (e) => {
    let file = e.target.files[0];
    const storageRef = ref(storage, `blog-images/${imageUid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.ceil(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setEdit(false);
        });
      }
    );
  };

  //
  const deleteBlog = () => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to leave this page?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const desertRef = ref(storage, `blog-images/${imageUid}`);
        deleteObject(desertRef).then(async() => {
          await deleteDoc(doc(db, "blogs", path));
          navigate('/home')
          swal("Deleted!", "Your imaginary file has been deleted!", "success");
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
        
      
      }
    });
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
              <img src={imageUrl} height={150} width={150} />
              <input type="file" onChange={(e) => UploadFile(e)} />
              <p style={{ color: messageType === "error" ? "red" : "green" }}>
                {message}
              </p>
              <Button title="Update" loader={loader} onClick={EditBlog} />
            </div>
          ) : (
            <div>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={deleteBlog}>Delete</button>
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
