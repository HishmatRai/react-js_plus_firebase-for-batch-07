import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Button = ({ title, onClick, loader }) => {
  return (
    <button onClick={onClick}>
      {loader ? <CircularProgress size={10} /> : title}
    </button>
  );
};
export default Button;
