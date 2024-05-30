// App.js
import React from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./components/SingupPage/SignupPage";
import HomePage from "./components/HomePage/HomePage";
import CartPage from "./components/CartPage/CartPage";
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
