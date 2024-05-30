import React from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";

const handleSignOut = () => {
  localStorage.removeItem("accessToken");
  window.location.reload();
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleHomePage = () => {
    navigate("/home");
  };

  const handleCartPage = () => {
    navigate("/cart");
  };

  return (
    <div className="navbar">
      <h1>
        <div className="brand">Cheapersal</div>
      </h1>
      <button className="signout-button" onClick={handleSignOut}>
        <span className="text">Sign out</span>
      </button>
      <button className="home-button" onClick={handleHomePage}>
        Home
      </button>
      <button className="cart-button" onClick={handleCartPage}>
        Cart
      </button>
    </div>
  );
};

export default Navbar;
