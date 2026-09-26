CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price)
VALUES
    (
        'CloudCart Laptop',
        'High-performance laptop for cloud engineers.',
        1299.99
    ),
    (
        'CloudCart Keyboard',
        'Mechanical keyboard for productive engineering workflows.',
        89.99
    )
ON CONFLICT DO NOTHING;