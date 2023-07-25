import React from "react";

const Input = ({ title, type, placeholder, value, onChange,disabled }) => {
  return (
    <div>
      <span>{title}</span> :
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled ={disabled}
      />
    </div>
  );
};
export default Input;
