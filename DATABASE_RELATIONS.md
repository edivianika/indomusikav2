# Database Relations Documentation

## 📊 Business Inquiries & Customer Services Relationship

### 🗄️ Table Structure

**business_inquiries table:**
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
    notes TEXT,
    cs_id INTEGER REFERENCES customer_services(id)  -- NEW RELATION
);
```

**customer_services table:**
```sql
CREATE TABLE customer_services (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nohp VARCHAR(20) NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔗 Relationship Details

**Foreign Key:**
- `business_inquiries.cs_id` → `customer_services.id`
- **Type:** One-to-Many (One CS can handle multiple inquiries)
- **Constraint:** Foreign key with referential integrity
- **Index:** `idx_business_inquiries_cs_id` for performance

### 📈 Data Flow

**1. Popup Submission Process:**
```javascript
// 1. Get next CS in rotation
const currentCS = getNextCustomerService();

// 2. Save inquiry with CS relation
await supabase.from('business_inquiries').insert([
  {
    business_name: businessName,
    cs_id: currentCS.id,  // Store CS relation
    status: 'new'
  }
]);

// 3. Redirect to CS WhatsApp
window.open(`https://wa.me/${currentCS.nohp}?text=${message}`);
```

**2. CS Rotation Logic:**
```javascript
// Round-robin rotation through active CS
const getNextCustomerService = () => {
  const currentCS = customerServices[currentCSIndex];
  setCurrentCSIndex((prevIndex) => (prevIndex + 1) % customerServices.length);
  return currentCS;
};
```

### 📊 Query Examples

**Get inquiries with CS details:**
```sql
SELECT 
  bi.id,
  bi.business_name,
  bi.cs_id,
  cs.nama as cs_name,
  cs.nohp as cs_phone,
  bi.created_at,
  bi.status
FROM business_inquiries bi
LEFT JOIN customer_services cs ON bi.cs_id = cs.id
ORDER BY bi.created_at DESC;
```

**Get CS workload:**
```sql
SELECT 
  cs.nama,
  cs.nohp,
  COUNT(bi.id) as total_inquiries,
  COUNT(CASE WHEN bi.status = 'new' THEN 1 END) as new_inquiries,
  COUNT(CASE WHEN bi.status = 'contacted' THEN 1 END) as contacted_inquiries
FROM customer_services cs
LEFT JOIN business_inquiries bi ON cs.id = bi.cs_id
WHERE cs.status = true
GROUP BY cs.id, cs.nama, cs.nohp
ORDER BY total_inquiries DESC;
```

**Get recent inquiries by CS:**
```sql
SELECT 
  cs.nama,
  bi.business_name,
  bi.created_at,
  bi.status
FROM business_inquiries bi
JOIN customer_services cs ON bi.cs_id = cs.id
WHERE bi.created_at >= NOW() - INTERVAL '7 days'
ORDER BY cs.nama, bi.created_at DESC;
```

### 🎯 Business Benefits

**1. CS Workload Tracking:**
- ✅ **Load Balancing:** Distribute inquiries evenly
- ✅ **Performance Monitoring:** Track CS response times
- ✅ **Workload Analysis:** Identify busy/available CS
- ✅ **Quality Control:** Monitor CS performance

**2. Customer Experience:**
- ✅ **Consistent Contact:** Same CS handles follow-up
- ✅ **Personalized Service:** CS knows customer history
- ✅ **Efficient Communication:** Direct WhatsApp contact
- ✅ **Professional Experience:** Organized customer service

**3. Business Analytics:**
- ✅ **CS Performance:** Track inquiry resolution rates
- ✅ **Workload Distribution:** Ensure fair distribution
- ✅ **Customer Journey:** Track from inquiry to conversion
- ✅ **ROI Analysis:** Measure CS effectiveness

### 🔧 Maintenance

**Adding New CS:**
```sql
-- Add new customer service
INSERT INTO customer_services (nama, nohp, status) 
VALUES ('New CS Name', '6281234567890', true);

-- Update rotation logic in application
-- No database changes needed - rotation is handled in code
```

**Deactivating CS:**
```sql
-- Deactivate CS (don't delete to preserve history)
UPDATE customer_services 
SET status = false 
WHERE id = ?;

-- Reassign pending inquiries
UPDATE business_inquiries 
SET cs_id = (SELECT id FROM customer_services WHERE status = true LIMIT 1)
WHERE cs_id = ? AND status = 'new';
```

**Data Cleanup:**
```sql
-- Archive old inquiries (optional)
UPDATE business_inquiries 
SET status = 'archived' 
WHERE created_at < NOW() - INTERVAL '1 year' 
AND status IN ('contacted', 'converted');
```

### 📊 Monitoring Queries

**Daily CS Performance:**
```sql
SELECT 
  DATE(bi.created_at) as date,
  cs.nama,
  COUNT(*) as inquiries,
  COUNT(CASE WHEN bi.status = 'contacted' THEN 1 END) as contacted,
  COUNT(CASE WHEN bi.status = 'converted' THEN 1 END) as converted
FROM business_inquiries bi
JOIN customer_services cs ON bi.cs_id = cs.id
WHERE bi.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(bi.created_at), cs.nama
ORDER BY date DESC, inquiries DESC;
```

**CS Response Time:**
```sql
SELECT 
  cs.nama,
  AVG(EXTRACT(EPOCH FROM (bi.updated_at - bi.created_at))/3600) as avg_response_hours,
  COUNT(*) as total_inquiries
FROM business_inquiries bi
JOIN customer_services cs ON bi.cs_id = cs.id
WHERE bi.status != 'new'
GROUP BY cs.nama
ORDER BY avg_response_hours;
```

### 🚀 Production Ready

**✅ Features Implemented:**
- ✅ **Foreign Key Relationship:** Proper database constraints
- ✅ **CS Rotation:** Round-robin distribution
- ✅ **Data Integrity:** Referential integrity maintained
- ✅ **Performance:** Indexed for fast queries
- ✅ **Monitoring:** Comprehensive analytics queries
- ✅ **Scalability:** Easy to add/remove CS
- ✅ **Maintenance:** Clear procedures for updates

**✅ Benefits:**
- 🎯 **Load Balancing:** Even distribution of inquiries
- 📊 **Analytics:** Comprehensive CS performance tracking
- 🔄 **Rotation:** Automatic CS assignment
- 📱 **Integration:** Direct WhatsApp contact
- 🛡️ **Data Integrity:** Proper foreign key constraints
- 📈 **Scalability:** Easy to scale CS team

