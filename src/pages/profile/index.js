import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar, Button, Input } from "../../components";
import { onSnapshot, getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from "../../config/firebase";
import Avatar from "@mui/material/Avatar";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore(firebase);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loader, setLoader] = useState(true);
  const [uid, setUid] = useState("");
  const [profielImagePath, setProfileImagePath] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          setUid(user.uid);
          const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            setLoader(false);
            console.log("Current data: ", doc.data());
            let data = doc.data();
            setFullName(data.fullName);
            setUserName(data.userName);
            setMobileNumber(data.mobileNumber);
            setGender(data.gender);
            setEmail(data.email);
            setProfileImagePath(data.profileURL);
          });
        } else {
          navigate("/email-verification");
        }
      } else {
        navigate("/login");
      }
    });
  }, []);

  const UpdateProfile = async () => {
    setMessageType("error");
    setLoading(true);
    if (fullName === "") {
      setMessage("Full Name required");
      setLoading(false);
    } else if (userName === "") {
      setMessage("Username required");
      setLoading(false);
    } else if (mobileNumber === "") {
      setMessage("Mobile number required");
      setLoading(false);
    } else if (gender === "") {
      setMessage("Gender required");
      setLoading(false);
    } else {
      // update
      const washingtonRef = doc(db, "users", uid);
      await updateDoc(washingtonRef, {
        fullName: fullName,
        userName: userName,
        mobileNumber: mobileNumber,
        gender: gender,
      });
      setLoading(false);
      setMessageType("success");
      setMessage("success");
    }
  };

  const UploadProfileImage = (e) => {
    let file = e.target.files[0];
    const storageRef = ref(storage, `profile-images/${uid}`);
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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setProfileImagePath(downloadURL);
          const washingtonRef = doc(db, "users", uid);
          await updateDoc(washingtonRef, {
            profileURL: downloadURL,
          });
        });
      }
    );
  };
  return (
    <div>
      <Navbar />
      {loader ? (
        <h1>Loading....</h1>
      ) : (
        <div>
          <Avatar
            alt="Remy Sharp"
            src={
              profielImagePath === ""
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlseazoU9HMxMy6AnQyEXjboZQaAXLhWmwtV6yFvc&s"
                : profielImagePath
            }
            style={{ width: 150, height: 150 }}
          />
          <input type="file" onChange={(e) => UploadProfileImage(e)} />
          <br />
          <br />
          <br />
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
            <option value="Female" selected={gender === "Female" && true}>
              Female
            </option>
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
          <Button title="Update" loader={loading} onClick={UpdateProfile} />
        </div>
      )}
    </div>
  );
};
export default Profile;
