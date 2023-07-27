import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import TextField from "@mui/material/TextField";
import { Button } from "./../../components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import uuid from "react-uuid";
import moment from "moment";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebase from "../../config/firebase";
function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

const CreateBlog = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore(firebase);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [imagePath, setPath] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uid, setUid] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setUid(user.uid);
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/login");
      }
    });
  }, []);

  // upload file
  const UploadFile = (e) => {
    setUploadStarted(true);
    let file = e.target.files[0];
    const storageRef = ref(storage, `blog-images/${uuid()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.ceil(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPath(downloadURL);
          setUploadStarted(false);
          setProgress("");
        });
      }
    );
  };

  const CreateBlog = async () => {
    setLoader(true);
    if (title === "") {
      setMessage("Title required");
      setMessageType("error");
      setLoader(false);
    } else if (details === "") {
      setMessage("Details required");
      setLoader(false);
      setMessageType("error");
    } else if (imagePath === "") {
      setMessage("Image required");
      setMessageType("error");
      setLoader(false);
    } else {
      const docRef = await addDoc(collection(db, "blogs"), {
        title: title,
        details: details,
        imagePath: imagePath,
        uid: uid,
        created: moment().format(),
      });
      const washingtonRef = doc(db, "blogs", docRef.id);
      await updateDoc(washingtonRef, {
        id: docRef.id,
      });
      setMessage("success");
      setMessageType("success");
      setTitle("");
      setDetails("");
      setPath("");
      setLoader(false);
    }
  };
  return (
    <div>
      <Navbar />

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
        {imagePath === "" ? (
          <div>
            {uploadStarted ? (
              <CircularProgressWithLabel value={progress} />
            ) : (
              <input type="file" onChange={(e) => UploadFile(e)} />
            )}
          </div>
        ) : (
          <img src={imagePath} height={150} width={150} />
        )}

        <p style={{ color: messageType === "error" ? "red" : "green" }}>
          {message}
        </p>
        <Button title="Create Blog" loader={loader} onClick={CreateBlog} />
      </div>
    </div>
  );
};
export default CreateBlog;
