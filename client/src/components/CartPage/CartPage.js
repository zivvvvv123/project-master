import NavBar from "../NavBar/NavBar";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
const AuthenticateUserToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found. Redirecting to login page.");
      return false;
    }

    const response = await fetch("http://localhost:8080/auth/tokenAuth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.error(
        "Unable to authenticate user. Redirecting back to login page."
      );
      return false;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
};

const CartPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await AuthenticateUserToken();
      if (!isAuthenticated) {
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate]);
  return (
    <div>
      <NavBar />
    </div>
  );
};
export default CartPage;
