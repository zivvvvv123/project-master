import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SingupPage/SignupPage";
import HomePage from "./components/HomePage/HomePage";
import CartPage from "./components/CartPage/CartPage";
import ResultPage from "./components/ResultPage/ResultPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
