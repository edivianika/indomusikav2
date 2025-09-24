-- Create business_inquiries table for storing lead data
CREATE TABLE IF NOT EXISTS business_inquiries (
    id SERIAL PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'new',
    phone_number VARCHAR(20),
    email VARCHAR(255),
    message TEXT,
    source VARCHAR(100) DEFAULT 'jasabuatlagu_page',
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_inquiries_status ON business_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_business_inquiries_created_at ON business_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_business_inquiries_business_name ON business_inquiries(business_name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to business_inquiries table
DROP TRIGGER IF EXISTS update_business_inquiries_updated_at ON business_inquiries;
CREATE TRIGGER update_business_inquiries_updated_at
    BEFORE UPDATE ON business_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE business_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all inquiries
CREATE POLICY "Allow authenticated users to read all business inquiries" ON business_inquiries
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert new inquiries
CREATE POLICY "Allow authenticated users to insert business inquiries" ON business_inquiries
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update inquiries
CREATE POLICY "Allow authenticated users to update business inquiries" ON business_inquiries
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for anonymous users to insert inquiries (for the popup)
CREATE POLICY "Allow anonymous users to insert business inquiries" ON business_inquiries
    FOR INSERT WITH CHECK (true);

-- Insert sample data for testing
INSERT INTO business_inquiries (business_name, status, source) VALUES
    ('Warung Makan Sederhana', 'new', 'jasabuatlagu_page'),
    ('Toko Kelontong Jaya', 'new', 'jasabuatlagu_page'),
    ('Salon Cantik', 'contacted', 'jasabuatlagu_page')
ON CONFLICT DO NOTHING;
