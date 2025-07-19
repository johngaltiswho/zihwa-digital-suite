# 🥋 Humility DB + E-commerce Backend Setup

## Overview

This Medusa backend serves both **Humility DB content** and **e-commerce products** using a unified product system with type-based separation.

## 🏗️ Architecture

### Product Types
- **`digital_content`** - Humility DB content (techniques, flow sessions, mindset modules)
- **`physical_product`** - E-commerce merchandise (gis, rashguards, equipment)

### Content Types (via metadata)
- **`technique`** - BJJ instructional videos
- **`flow`** - Flow state training sessions  
- **`mindset`** - Mindset and philosophy modules
- **`merchandise`** - Physical products for sale

## 🚀 Getting Started

### 1. Install & Setup
```bash
cd apps/medusa-backend
npm install
```

### 2. Set up Environment Variables
Create `.env` file:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/fluvium_db
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:7001
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
```

### 3. Run Database Migrations
```bash
npm run build
npx medusa db:migrate
```

### 4. Seed Sample Data
```bash
npx medusa exec ./src/scripts/seed-humility-db.ts
```

### 5. Start the Server
```bash
npm run dev
# Backend: http://localhost:9000
# Admin: http://localhost:7001
```

## 📡 API Endpoints

### Humility DB Content
```bash
# Get all content
GET /store/humility-db
?content_type=technique|flow|mindset
?difficulty_level=beginner|intermediate|advanced
?limit=20&offset=0

# Get techniques only
GET /store/humility-db/techniques
?difficulty_level=beginner|intermediate|advanced
?category=guard|passing|submissions

# Get flow sessions only
GET /store/humility-db/flow-sessions
?session_type=guided|meditation|advanced|restorative
?difficulty_level=beginner|all_levels|advanced

# Get mindset modules only
GET /store/humility-db/mindset-modules
?module_type=philosophy|psychology|leadership
?difficulty_level=beginner|intermediate|advanced
```

### E-commerce Products
```bash
# Get shop products only
GET /store/shop
?category=apparel|training-equipment
?limit=20&offset=0
```

## 🎯 Sample Data Structure

### Technique Content
```json
{
  "id": "prod_123",
  "title": "Guard Retention Flow",
  "description": "Master guard retention...",
  "handle": "guard-retention-flow",
  "type": "digital_content",
  "metadata": {
    "content_type": "technique",
    "youtube_url": "https://youtube.com/watch?v=abc123",
    "youtube_id": "abc123",
    "difficulty_level": "intermediate",
    "duration_minutes": 15,
    "instructor_notes": "Focus on hip movement...",
    "key_points": ["Hip escape", "Grip fighting"],
    "prerequisites": ["Basic guard"],
    "next_techniques": ["Triangle setup"]
  }
}
```

### Flow Session Content
```json
{
  "id": "prod_456",
  "title": "Breath & Movement Integration",
  "type": "digital_content",
  "metadata": {
    "content_type": "flow",
    "session_type": "guided",
    "duration_minutes": 10,
    "difficulty_level": "all_levels",
    "audio_url": "https://example.com/audio.mp3",
    "instructions": "Find comfortable position...",
    "key_concepts": ["Box breathing", "Movement sync"]
  }
}
```

### E-commerce Product
```json
{
  "id": "prod_789",
  "title": "Fluvium Training Gi - Black",
  "type": "physical_product",
  "variants": [
    {
      "title": "A2",
      "inventory_quantity": 10,
      "prices": [{"currency_code": "USD", "amount": 12900}]
    }
  ],
  "metadata": {
    "content_type": "merchandise",
    "material": "100% cotton",
    "sizes": ["A1", "A2", "A3", "A4"]
  }
}
```

## 🎛️ Admin Dashboard

### Content Management
1. **Products** → Filter by type: `digital_content`
2. **Categories** → Organize by content type
3. **Collections** → Group by difficulty/series

### E-commerce Management  
1. **Products** → Filter by type: `physical_product`
2. **Orders** → Standard e-commerce workflow
3. **Inventory** → Stock management

## 🔄 Content Workflow

### Adding New Technique
1. Go to **Products** in admin
2. Click **Add Product**
3. Set **Type**: `digital_content`
4. Fill basic info (title, description, handle)
5. Add to appropriate **Category** (e.g., "Guard Techniques")
6. Set **Metadata**:
   ```json
   {
     "content_type": "technique",
     "youtube_url": "https://youtube.com/watch?v=YOUR_VIDEO_ID",
     "youtube_id": "YOUR_VIDEO_ID",
     "difficulty_level": "beginner|intermediate|advanced",
     "duration_minutes": 15,
     "instructor_notes": "Key teaching points...",
     "key_points": ["Point 1", "Point 2", "Point 3"],
     "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
     "next_techniques": ["Next technique 1", "Next technique 2"]
   }
   ```
7. Set **Status**: `published`
8. Save

### Adding New E-commerce Product
1. Go to **Products** in admin
2. Click **Add Product**
3. Set **Type**: `physical_product`
4. Fill basic info + variants (sizes, prices)
5. Add to **Category** (e.g., "Apparel")
6. Set **Metadata**:
   ```json
   {
     "content_type": "merchandise",
     "material": "100% cotton",
     "sizes": ["S", "M", "L", "XL"],
     "care_instructions": "Machine wash cold"
   }
   ```
7. Set **Status**: `published`
8. Save

## 🎨 Frontend Integration

### Fetch Techniques
```javascript
// Get all techniques
const response = await fetch('/store/humility-db/techniques');
const { techniques } = await response.json();

// Get beginner techniques only
const response = await fetch('/store/humility-db/techniques?difficulty_level=beginner');
const { techniques } = await response.json();
```

### Fetch Shop Products
```javascript
// Get all shop products
const response = await fetch('/store/shop');
const { products } = await response.json();

// Get apparel only
const response = await fetch('/store/shop?category=apparel');
const { products } = await response.json();
```

## 🔧 Customization

### Adding New Content Type
1. Update seeding script with new categories
2. Add new API endpoint in `/src/api/store/humility-db/`
3. Update frontend to handle new content type

### Adding New Product Fields
1. Update metadata structure in seeding script
2. Update API response transformation
3. Update admin interface if needed

## 🚀 Production Considerations

### Performance
- Add database indexes on frequently queried fields
- Implement caching for content responses
- Consider CDN for video content

### Security
- Add authentication for premium content
- Implement rate limiting on API endpoints
- Validate metadata structure

### Scalability
- Consider separating content and commerce databases
- Implement search functionality (Elasticsearch/Algolia)
- Add content versioning system

## 📞 Support

For questions or issues:
- Check Medusa documentation: https://docs.medusajs.com
- Review API endpoints in `/src/api/store/`
- Check seeding script for data structure examples