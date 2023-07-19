import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, NotFound ,Loader,Login,SignUp} from "../../pages";
const RouterNavigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default RouterNavigation;
