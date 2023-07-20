import React from "react";

const Input = ({ title, type, placeholder, value, onChange }) => {
  return (
    <div>
      <span>{title}</span> :
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
export default Input;
