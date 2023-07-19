import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./../../components";
const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, serMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <h1>SignUp</h1>
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
        onChange={(e) => serMobileNumber(e.target.value)}
      />
      <select onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <Input
        title="Email Address"
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        title="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Link to="/login">Login</Link>
    </div>
  );
};
export default SignUp;
