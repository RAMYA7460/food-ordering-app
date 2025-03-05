import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://api.spoonacular.com/food/menuItems/search?query=dessert&number=10&apiKey=f064e794f62c45879e8d68e13642a867";

const FoodOrderingApp = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setItems(response.data.menuItems || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, price: item.price || (Math.random() * (10 - 5) + 5).toFixed(2), quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price || 0), 0);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Desserts</h1>
        <input
          type="text"
          placeholder="Search desserts..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading">Loading desserts...</p>
      ) : (
        <div className="content">
          <div className="grid">
            {items
              .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="card">
                  <div className="image-container">
                    <img src={item.image} alt={item.title} className="item-img" />
                  </div>
                  <h2 className="item-title">{item.title}</h2>
                  <p className="item-price">
                    ${item.price ? item.price.toFixed(2) : (Math.random() * (10 - 5) + 5).toFixed(2)}
                  </p>
                  <button className="add-btn" onClick={() => addToCart(item)}>🛒 Add to Cart</button>
                </div>
              ))}
          </div>

          <div className="cart-container">
            <h2 className="cart-title">Your Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              cart.map((item, index) => (
                <div key={item.id} className="cart-item">
                  <span>{item.title} - {item.quantity} × ${item.price}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                </div>
              ))
            )}
            <div className="total-section">
              <p className="total-price">Total: <span className="total-amount">${totalAmount.toFixed(2)}</span></p>
              <p className="carbon-neutral">🌱 This is a carbon-neutral delivery</p>
              <button className="checkout">Confirm Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodOrderingApp;