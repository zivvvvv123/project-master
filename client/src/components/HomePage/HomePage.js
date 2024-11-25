import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
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

const HomePage = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

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
        // Sort products by number of matches in descending order
        const sortedProducts = data.sort((a, b) => b.matches - a.matches);
        setProducts(sortedProducts);
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

  const handleSearch = async (query) => {
    try {
      const response = await fetch("http://localhost:8080/products/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error("Failed to search products");
      }
      const data = await response.json();
      // Sort products by number of matches in descending order
      const sortedProducts = data.sort((a, b) => b.matches - a.matches);
      setProducts(sortedProducts);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleAddToCart = (product) => {
    const updatedCart = [
      ...cart,
      { ...product, _id: product._ids[0], quantity: 1 },
    ];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div>
      <NavBar />
      <div className="home-container">
        <div className="home-content">
          <div className="main-header">Cheapersal</div>
          <SearchBar onSearch={handleSearch} />
          <div className="product-container">
            {products.map((product, index) => (
              <div className="product" key={index}>
                <img src={product.image_url} alt={product.product_name} />
                <div className="product-info">
                  <div className="product-name">{product.product_name}</div>
                  <div className="product-price">
                    {(() => {
                      const price = product.cheapest_price;
                      const pricePerKg = parseFloat(
                        product.cheapest_price_per_kg
                      );
                      const homePrice = product.price;
                      const homePricePerKg = product.price_per_kg;
                      if (homePrice != null) {
                        return `${homePrice} ₪`;
                      } else if (homePricePerKg != null) {
                        return `${pricePerKg} ₪/kg`;
                      }
                      if (price != null) {
                        return `${price} ₪`;
                      } else if (pricePerKg != null) {
                        return `${pricePerKg} ₪/kg`;
                      } else {
                        return "N/A";
                      }
                    })()}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <div className="product-details">
                    <div>Quantity: {product.quantity}</div>
                    <div>Unit: {product.unit}</div>
                    <div>Matches: {product.matches}</div>
                  </div>
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
