-- Create orders table to store form submissions
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  nama_usaha VARCHAR(255) NOT NULL,
  jenis_usaha VARCHAR(255) NOT NULL,
  target_audiens VARCHAR(255) NOT NULL,
  gaya_musik TEXT[] NOT NULL,
  pesan_utama TEXT NOT NULL,
  tagline VARCHAR(255),
  cs_id INTEGER REFERENCES customer_services(id),
  cs_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_cs_id ON orders(cs_id);
