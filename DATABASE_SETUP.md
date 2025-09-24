# Database Setup untuk Business Inquiries

## 📋 Overview
Dokumentasi ini menjelaskan cara setup database untuk menyimpan leads dari popup business name.

## 🗄️ Tabel yang Dibutuhkan

### business_inquiries
Tabel untuk menyimpan data leads dari popup.

**Struktur Tabel:**
```sql
CREATE TABLE business_inquiries (
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
```

## 🚀 Setup Instructions

### 1. Buka Supabase Dashboard
- Login ke [Supabase Dashboard](https://supabase.com/dashboard)
- Pilih project Anda
- Pergi ke **SQL Editor**

### 2. Jalankan Migration
Copy dan paste script dari `scripts/create_business_inquiries_table.sql` ke SQL Editor, lalu klik **Run**.

### 3. Verifikasi Setup
- Pergi ke **Table Editor**
- Cari tabel `business_inquiries`
- Pastikan tabel sudah dibuat dengan benar

## 📊 Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL | Primary key, auto-increment |
| `business_name` | VARCHAR(255) | Nama usaha dari popup |
| `created_at` | TIMESTAMP | Waktu data dibuat |
| `updated_at` | TIMESTAMP | Waktu data terakhir diupdate |
| `status` | VARCHAR(50) | Status lead: 'new', 'contacted', 'converted' |
| `phone_number` | VARCHAR(20) | Nomor telepon (optional) |
| `email` | VARCHAR(255) | Email (optional) |
| `message` | TEXT | Pesan tambahan (optional) |
| `source` | VARCHAR(100) | Sumber lead: 'jasabuatlagu_page' |
| `notes` | TEXT | Catatan internal (optional) |

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ **Enabled**: Tabel dilindungi dengan RLS
- ✅ **Anonymous Insert**: Popup bisa insert data
- ✅ **Authenticated Read**: Hanya user terautentikasi yang bisa baca
- ✅ **Data Protection**: Data terlindungi dari akses tidak sah

### Policies
```sql
-- Anonymous users can insert (for popup)
CREATE POLICY "Allow anonymous users to insert business inquiries" 
ON business_inquiries FOR INSERT WITH CHECK (true);

-- Authenticated users can read all
CREATE POLICY "Allow authenticated users to read all business inquiries" 
ON business_inquiries FOR SELECT USING (auth.role() = 'authenticated');
```

## 📈 Performance Optimizations

### Indexes
- ✅ **Status Index**: `idx_business_inquiries_status`
- ✅ **Created At Index**: `idx_business_inquiries_created_at`
- ✅ **Business Name Index**: `idx_business_inquiries_business_name`

### Triggers
- ✅ **Updated At Trigger**: Otomatis update `updated_at` saat data diubah

## 🧪 Testing

### Sample Data
Script migration sudah include sample data:
```sql
INSERT INTO business_inquiries (business_name, status, source) VALUES
    ('Warung Makan Sederhana', 'new', 'jasabuatlagu_page'),
    ('Toko Kelontong Jaya', 'new', 'jasabuatlagu_page'),
    ('Salon Cantik', 'contacted', 'jasabuatlagu_page');
```

### Test Popup
1. Buka halaman `/jasabuatlagu`
2. Klik tombol WhatsApp
3. Masukkan nama usaha
4. Klik "Lanjut ke WhatsApp"
5. Cek tabel `business_inquiries` di Supabase

## 📊 Monitoring & Analytics

### Query Examples
```sql
-- Lihat semua leads baru
SELECT * FROM business_inquiries WHERE status = 'new';

-- Hitung leads per hari
SELECT DATE(created_at) as date, COUNT(*) as leads
FROM business_inquiries 
GROUP BY DATE(created_at) 
ORDER BY date DESC;

-- Lihat leads dari halaman jasabuatlagu
SELECT * FROM business_inquiries WHERE source = 'jasabuatlagu_page';
```

## 🔧 Troubleshooting

### Common Issues
1. **RLS Error**: Pastikan policies sudah dibuat dengan benar
2. **Insert Failed**: Cek apakah anonymous insert policy aktif
3. **Permission Denied**: Pastikan user sudah terautentikasi untuk read access

### Debug Steps
1. Cek Supabase logs untuk error details
2. Test insert manual di SQL Editor
3. Verifikasi RLS policies
4. Cek network tab di browser untuk request details

## 📝 Next Steps

Setelah setup database:
1. ✅ Test popup functionality
2. ✅ Monitor leads di Supabase dashboard
3. ✅ Setup notification untuk leads baru
4. ✅ Implement lead management system
5. ✅ Add analytics dan reporting

## 🆘 Support

Jika ada masalah dengan setup:
1. Cek Supabase documentation
2. Verifikasi project settings
3. Test dengan sample data
4. Contact support jika diperlukan
