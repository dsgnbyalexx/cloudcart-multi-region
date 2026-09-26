const express = require("express");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "cloudcart-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ready",
      service: "cloudcart-api",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Readiness check failed:", error);

    res.status(503).json({
      status: "not_ready",
      service: "cloudcart-api",
      database: "disconnected"
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, price FROM products ORDER BY id"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      error: "Failed to fetch products"
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        error: "Product ID must be an integer"
      });
    }

    const result = await pool.query(
      "SELECT id, name, description, price FROM products WHERE id = $1",
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch product:", error);

    res.status(500).json({
      error: "Failed to fetch product"
    });
  }
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudCart API listening on port ${PORT}`);
  });
}

module.exports = app;