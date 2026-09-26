const request = require("supertest");
const app = require("../src/server");
const pool = require("../src/db");

describe("CloudCart API", () => {
  test("GET /health returns healthy status", async () => {
    const response = await request(app)
      .get("/health")
      .expect(200);

    expect(response.body.status).toBe("healthy");
    expect(response.body.service).toBe("cloudcart-api");
  });

  test("GET /ready confirms database connectivity", async () => {
    const response = await request(app)
      .get("/ready")
      .expect(200);

    expect(response.body.status).toBe("ready");
    expect(response.body.database).toBe("connected");
  });

  test("GET /products returns products from PostgreSQL", async () => {
    const response = await request(app)
      .get("/products")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("price");
  });

  test("GET /products/:id returns a product", async () => {
    const response = await request(app)
      .get("/products/1")
      .expect(200);

    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe("CloudCart Laptop");
  });

  test("GET /products/:id returns 404 for unknown product", async () => {
    const response = await request(app)
      .get("/products/999999")
      .expect(404);

    expect(response.body.error).toBe("Product not found");
  });

  test("GET /products/:id rejects invalid IDs", async () => {
    const response = await request(app)
      .get("/products/not-a-number")
      .expect(400);

    expect(response.body.error).toBe("Product ID must be an integer");
  });
});
afterAll(async () => {
  await pool.end();
});