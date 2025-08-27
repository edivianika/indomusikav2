-- Insert additional jingle samples to have 12 total records
INSERT INTO jingle_samples (title, description, audio_url, cover_image_url, business_type) VALUES
('Restoran Padang Sederhana', 'Jingle autentik untuk masakan Padang', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop', 'Restoran'),
('Toko Elektronik Maju', 'Jingle modern untuk toko elektronik', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&fit=crop', 'Elektronik'),
('Apotek Sehat Sentosa', 'Jingle terpercaya untuk apotek keluarga', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop', 'Apotek'),
('Barbershop Classic', 'Jingle bergaya untuk barbershop pria', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop', 'Barbershop'),
('Butik Fashion Trendy', 'Jingle stylish untuk butik fashion wanita', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop', 'Fashion'),
('Gym Fitness Pro', 'Jingle energik untuk pusat kebugaran', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', 'Fitness'),
('Toko Buah Segar', 'Jingle segar untuk toko buah dan sayur', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop', 'Retail'),
ON CONFLICT DO NOTHING;