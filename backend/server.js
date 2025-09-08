const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret";  

 
app.use(cors());
app.use(bodyParser.json());

 
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        
  password: "<Enter MySQL Password here>",  //Enter the password of your database of MySQL        
  database: "Forever",  
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

 
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

   
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

     
    const hashedPassword = await bcrypt.hash(password, 10);

     
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: "Error saving user" });
        return res.json({ message: "Signup successful" });
      }
    );
  });
});


 
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

     
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Login successful",
      token,
      userId: user.id,    
      name: user.name,
      email: user.email,
    });
  });
});


 

 
app.get("/cart/:user_id", (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);   
  db.query("SELECT * FROM Carting WHERE user_id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


 
app.post("/cart/add", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  db.query(
    "SELECT * FROM Carting WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        db.query(
          "UPDATE Carting SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
          [quantity, user_id, product_id],
          (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Quantity updated" });
          }
        );
      } else {
        db.query(
          "INSERT INTO Carting (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [user_id, product_id, quantity],
          (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Item added to cart" });
          }
        );
      }
    }
  );
});

 
app.post("/cart/decrease", (req, res) => {
  const { user_id, product_id } = req.body;

  db.query(
    "SELECT * FROM Carting WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(400).json({ message: "Item not in cart" });

      const currentQty = results[0].quantity;
      if (currentQty <= 1) {
        db.query(
          "DELETE FROM Carting WHERE user_id = ? AND product_id = ?",
          [user_id, product_id],
          (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Item removed from cart" });
          }
        );
      } else {
        db.query(
          "UPDATE Carting SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?",
          [user_id, product_id],
          (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Quantity decreased" });
          }
        );
      }
    }
  );
});


 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

