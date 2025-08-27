-- Create table for jingle samples
CREATE TABLE IF NOT EXISTS jingle_samples (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_image_url TEXT,
  business_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO jingle_samples (title, description, audio_url, cover_image_url, business_type) VALUES
('Toko Kopi Ndeso', 'Jingle untuk kopi lokal dengan nuansa tradisional', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop', 'Kafe'),
('Laundry Express', 'Jingle cepat dan energik untuk layanan laundry', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', 'Laundry'),
('Warung Sembako Amanah', 'Jingle hangat untuk warung sembako keluarga', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 'Retail'),
('Bengkel Motor Jaya', 'Jingle untuk bengkel motor dengan beat kuat', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop', 'Bengkel'),
('Salon Cantik Indah', 'Jingle elegan untuk salon kecantikan', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop', 'Salon');
