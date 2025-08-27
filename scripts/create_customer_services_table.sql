-- Create customer services table
CREATE TABLE IF NOT EXISTS customer_services (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  nohp VARCHAR(20) NOT NULL,
  status BOOLEAN DEFAULT true, -- true = on, false = off
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample CS data
INSERT INTO customer_services (nama, nohp, status) VALUES
('Sari Customer Service', '6281234567890', true),
('Budi Customer Service', '6281234567891', true),
('Rina Customer Service', '6281234567892', false),
('Doni Customer Service', '6281234567893', true)
ON CONFLICT DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cs_status ON customer_services(status);
