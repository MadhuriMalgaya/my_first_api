const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// middleware to parse JSON body
app.use(express.json());

// Serve images from the "public/images" folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const fs = require("fs");
// initial data
let products = JSON.parse(fs.readFileSync("data/popularProducts.json"));
let recommendeds = JSON.parse(fs.readFileSync("data/recommendedProducts.json"));
let stateFamousFood = JSON.parse(fs.readFileSync("data/stateFamousFood.json"));

// GET route (fetch products)
app.get("/api/v1/products/popular", (req, res) => {
  res.json({
    total_size: products.length,
    type_id: 1,
    offset: 0,
    products: products
  });
});

// POST route to update products
app.post("/api/v1/products/popular", (req, res) => {
  console.log("Received POST body:", req.body);
  if (!req.body.products) return res.status(400).json({ error: "Missing products array" });
  
  products = req.body.products.map(p => {
    if (!p.img.startsWith("http")) {
      p.img = `${p.img}`;
    }
    return p;
  });

  res.json({ message: "Products updated successfully!", products });
});

// ------------------ RECOMMENDED PRODUCTS ------------------ //
app.get("/api/v1/products/recommended", (req, res) => {
  res.json({
    total_size: recommendeds.length,
    type_id: 2,
    offset: 0,
    products: recommendeds
  });
});

app.post("/api/v1/products/recommended", (req, res) => {
  if (!req.body.products) return res.status(400).json({ error: "Missing products array" });

  recommendeds = req.body.products.map(p => {
    if (!p.img.startsWith("http")) p.img = `${p.img}`;
    return p;
  });

  // Save back to JSON file
  fs.writeFileSync("data/recommendedProducts.json", JSON.stringify(recommendeds, null, 2));

  res.json({ message: "Recommended products updated!", products: recommendeds });
});

// ------------------ STATE FAMOUS FOOD ------------------ //
app.get("/api/v1/products/state_famous_food", (req, res) => {
  res.json({
    total_size: stateFamousFood.length,
    type_id: 3,
    offset: 0,
    products: stateFamousFood
  });
});

app.post("/api/v1/products/state_famous_food", (req, res) => {
  if (!req.body.products) return res.status(400).json({ error: "Missing products array" });

  stateFamousFood = req.body.products.map(p => {
    if (!p.img.startsWith("http")) p.img = `${p.img}`;
    return p;
  });

  // Save back to JSON file
  fs.writeFileSync("data/stateFamousFood.json", JSON.stringify(stateFamousFood, null, 2));

  res.json({ message: "State famous food updated!", products: stateFamousFood });
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
