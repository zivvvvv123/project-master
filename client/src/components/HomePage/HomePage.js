import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";

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
        Authorization: `Bearer ${accessToken}`, // Use "Bearer" prefix
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

const HomePage = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/products/randomProducts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    const checkAuthentication = async () => {
      const isAuthenticated = await AuthenticateUserToken();
      setAuthenticated(isAuthenticated);
      if (!isAuthenticated) {
        navigate("/login");
      }
    };

    checkAuthentication();
    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (productId) => {
    // Handle adding product to cart
    console.log(`Product added to cart: ${productId}`);
  };

  return (
    <div>
      <NavBar />
      <div className="home-container">
        <div className="home-content">
          <div className="main-header">Cheapersal</div>
          <div className="product-container">
            {products.map((product, index) => (
              <div className="product" key={index}>
                <img src={product.image_url} alt={product.product_name} />
                <div className="product-info">
                  <div className="product-name">{product.product_name}</div>
                  <div className="product-price">{product.price}</div>
                  <div className="product-price">{product.price_per_kg}</div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
