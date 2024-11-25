import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
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
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await AuthenticateUserToken();
      if (!isAuthenticated) {
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    console.log("Cart items on load:", cartItems); // Debug log
  }, [cartItems]);

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  const handleRemoveItem = (itemId) => {
    console.log("Removing item with ID:", itemId); // Debug log
    console.log("Cart before removal:", cartItems); // Debug log

    const updatedCart = cartItems.filter((item) => item._id !== itemId);

    console.log("Cart after removal:", updatedCart); // Debug log

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId && (item.quantity || 1) > 1
        ? { ...item, quantity: (item.quantity || 1) - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleComparePrices = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/products/calculatePrices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to calculate prices");
      }

      const data = await response.json();
      navigate("/result", { state: { totalPrices: data } });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="cart-container">
        <button className="clear-cart-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div>Your cart is empty.</div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={item.image_url} alt={item.product_name} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product_name}</div>
                  <div className="cart-item-price">
                    {(() => {
                      const price = item.cheapest_price;
                      const pricePerKg = parseFloat(item.cheapest_price_per_kg);
                      const homePrice = item.price;
                      const homePricePerKg = item.price_per_kg;

                      if (homePrice != null) {
                        return `${homePrice} ₪`;
                      } else if (homePricePerKg != null) {
                        return `${homePricePerKg} ₪/kg`;
                      } else if (price != null) {
                        return `${price} ₪`;
                      } else if (pricePerKg != null) {
                        return `${pricePerKg} ₪/kg`;
                      } else {
                        return "N/A";
                      }
                    })()}
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => handleDecreaseQuantity(item._id)}>
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => handleIncreaseQuantity(item._id)}>
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <button className="compare-prices-btn" onClick={handleComparePrices}>
          Compare Prices
        </button>
      </div>
    </div>
  );
};

export default CartPage;
