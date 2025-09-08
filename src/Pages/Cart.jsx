import React, { useEffect, useState } from "react";
import { products } from "../assets/all_products"; 

const Cart = () => {
  const [cart, setCart] = useState([]);
  const userId = Number(localStorage.getItem("userId")); 

  
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

  
  const increaseQty = async (productId) => {
    await fetch("http://localhost:5000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: productId, quantity: 1 }),
    });
    fetchCart();
  };

  
  const decreaseQty = async (productId) => {
    await fetch("http://localhost:5000/cart/decrease", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: productId, quantity: 1 }),
    });
    fetchCart();
  };

  
const getCartItems = () => {
  return cart.map((c) => {
    const product = products.find((p) => p._id === c.product_id); 
    return { ...c, ...product };
  });
};


  
  const totalPrice = getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {getCartItems().map((item) => (
            <div
              key={item.product_id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <img
                src={item.image && item.image.length > 0 ? item.image[0] : "https://via.placeholder.com/100"}
                alt={item.name}
                style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "20px" }}
              />
              <div style={{ flex: 1 }}>
                <h4>{item.name}</h4>
                <p>${item.price}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => decreaseQty(item.product_id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.product_id)}>+</button>
              </div>
            </div>
          ))}
          <h3>Total: ${totalPrice}</h3>
        </div>
      )}
    </div>
  );
};

export default Cart;

