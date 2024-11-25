import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./ResultPage.css";

const fetchSupermarketsByIds = async (supermarketIds) => {
  try {
    const response = await fetch(
      "http://localhost:8080/products/getSupermarketsByIds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ supermarketIds }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch supermarkets by IDs");
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

const ResultPage = () => {
  const location = useLocation();
  const totalPrices = location.state?.totalPrices || {};
  const [supermarketNames, setSupermarketNames] = useState({});

  useEffect(() => {
    const fetchSupermarketNames = async () => {
      const supermarketIds = Object.keys(totalPrices);
      const supermarkets = await fetchSupermarketsByIds(supermarketIds);

      const namesMap = supermarkets.reduce((acc, supermarket) => {
        acc[supermarket._id] = supermarket.name;
        return acc;
      }, {});

      setSupermarketNames(namesMap);
    };

    fetchSupermarketNames();
  }, [totalPrices]);

  return (
    <div>
      <NavBar />
      <div className="result-container">
        <h1>Price Comparison</h1>
        <div className="total-prices">
          {Object.keys(totalPrices).map((supermarketId, index) => (
            <div key={index} className="total-price">
              <div>
                Supermarket: {supermarketNames[supermarketId] || supermarketId}(
                {totalPrices[supermarketId]?.productCount || 0} products)
              </div>
              <div>
                Total Price:{" "}
                {typeof totalPrices[supermarketId]?.totalPrice === "number"
                  ? totalPrices[supermarketId].totalPrice.toFixed(2)
                  : "N/A"}{" "}
                ₪
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
