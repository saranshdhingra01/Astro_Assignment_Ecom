import React, { useState, useEffect } from "react";
import { products } from "../assets/all_products";  

const ProductsPage = () => {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");  

   
  const fetchCart = async () => {
    if (!userId) return;
    const res = await fetch(`http://localhost:5000/cart/${userId}`);
    const data = await res.json();
    console.log("Cart data:", data);
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

   
  const addToCart = async (productId) => {
    await fetch("http://localhost:5000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: productId, quantity: 1 }),  
    });
    fetchCart();
  };

   
  const decreaseFromCart = async (productId) => {
    await fetch("http://localhost:5000/cart/decrease", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: productId }),  
    });
    fetchCart();
  };

   
  const getQuantity = (productId) => {
    const item = cart.find((c) => c.product_id === productId);  
    return item ? item.quantity : 0;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {products.map((product) => {
          const qty = getQuantity(product._id);
          return (
            <div
              key={product._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <img
                src={product.image && product.image.length > 0 ? product.image[0] : "https://via.placeholder.com/200"}
                alt={product.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              {qty === 0 ? (
                <button
                  onClick={() => addToCart(product._id)}
                  style={{
                    padding: "10px 15px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={() => decreaseFromCart(product._id)}
                    style={{
                      padding: "5px 10px",
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    style={{
                      padding: "5px 10px",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;


