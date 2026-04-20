# 📁 Project Structure Guide

## 📂 Cấu trúc Thư mục

```
CSDL/
│
├── 📄 README.md                    # Tài liệu chính
├── 📄 QUICK_START.md              # Hướng dẫn khởi chạy nhanh
├── 📄 API_DOCS.md                 # Tài liệu API
├── 📄 PROJECT_STRUCTURE.md        # File này
├── 📄 .gitignore                  # Git ignore file
│
├── 📁 backend/                    # Node.js Backend Server
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── database.ts        # Cấu hình TypeORM & MySQL
│   │   ├── 📁 entities/           # ORM Entity Models
│   │   │   ├── Customer.ts        # Entity: Khách hàng
│   │   │   ├── Order.ts           # Entity: Đơn hàng
│   │   │   ├── Product.ts         # Entity: Sản phẩm
│   │   │   └── OrderDetail.ts     # Entity: Chi tiết đơn hàng
│   │   ├── 📁 services/           # Business Logic
│   │   │   ├── SearchService.ts   # Xử lý tìm kiếm
│   │   │   └── StatisticsService.ts # Xử lý thống kê
│   │   ├── 📁 controllers/        # HTTP Request Handlers
│   │   │   ├── SearchController.ts    # API tìm kiếm
│   │   │   └── StatisticsController.ts # API thống kê
│   │   ├── 📁 routes/             # API Routes
│   │   │   ├── search.ts          # Route tìm kiếm
│   │   │   └── statistics.ts      # Route thống kê
│   │   └── main.ts                # Express App Entry Point
│   ├── 📄 package.json            # Dependencies
│   ├── 📄 tsconfig.json           # TypeScript Config
│   ├── 📄 .env                    # Environment Variables
│   └── 📁 dist/                   # Compiled JavaScript (generated)
│       └── 📁 (auto-generated)
│
└── 📁 frontend/                   # HTML/CSS/JS Frontend
    ├── 📄 index.html              # Main HTML Page
    ├── 📄 style.css               # Styling
    └── 📄 script.js               # Frontend Logic
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ index.html (UI)                                      │   │
│  │ script.js (Fetch API calls)                          │   │
│  │ style.css (Styling)                                  │   │
│  │ Chart.js (Visualizations)                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────────────┘
                  │ HTTP Requests (REST)
                  │ http://localhost:5000/api/**
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js/Express)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Express Router (routes/)                             │   │
│  │  ├── /search/** → SearchController                   │   │
│  │  └── /statistics/** → StatisticsController           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Controller Layer (controllers/)                       │   │
│  │  ├── Nhận HTTP request                               │   │
│  │  ├── Gọi Service layer                               │   │
│  │  └── Trả về JSON response                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Service Layer (services/)                            │   │
│  │  ├── Business logic                                  │   │
│  │  ├── TypeORM queries                                 │   │
│  │  └── Data processing                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────────────┘
                  │ SQL Queries (TypeORM)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│            DATABASE (MySQL - Classicmodels)                  │
│  ├── customers (Bảng khách hàng)                            │
│  ├── orders (Bảng đơn hàng)                                 │
│  ├── products (Bảng sản phẩm)                               │
│  └── orderdetails (Bảng chi tiết đơn hàng)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Layers

### Layer 1: Routes (`/routes`)
- Định nghĩa các endpoint HTTP
- Map URL → Controller
- Example: `/api/search/customers` → SearchController.searchCustomers()

### Layer 2: Controllers (`/controllers`)
- Nhận HTTP request từ routes
- Gọi services để xử lý logic
- Format response thành JSON
- Handle HTTP status codes

### Layer 3: Services (`/services`)
- Chứa business logic chính
- Tương tác với database qua TypeORM
- Xử lý dữ liệu trước khi trả về
- Reusable logic

### Layer 4: Entities (`/entities`)
- Định nghĩa structure của database tables
- TypeORM decorators (`@Entity`, `@Column`, etc.)
- Quan hệ giữa các entities (`@ManyToOne`, `@OneToMany`)

### Layer 5: Config (`/config`)
- Cấu hình TypeORM datasource
- Cấu hình database connection
- Cấu hình entities

---

## 📡 API Endpoints Summary

### Search Endpoints
```
GET /api/search/customers?keyword=<string>
GET /api/search/products?keyword=<string>
GET /api/search/orders?startDate=<date>&endDate=<date>
GET /api/search/global?keyword=<string>
```

### Statistics Endpoints
```
GET /api/statistics/by-customer
GET /api/statistics/by-time
GET /api/statistics/by-product
GET /api/statistics/pivot
GET /api/statistics/top-customers?limit=10
GET /api/statistics/top-products?limit=10
```

### Health Check
```
GET /api/health
```

---

## 🗄️ Database Schema

### Customers Table
```sql
CREATE TABLE customers (
  customerNumber INT PRIMARY KEY,
  customerName VARCHAR(100),
  city VARCHAR(50),
  country VARCHAR(50),
  phone VARCHAR(20),
  creditLimit DECIMAL(10,2)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  orderNumber INT PRIMARY KEY,
  orderDate DATE,
  shippedDate DATE,
  status VARCHAR(30),
  customerNumber INT FOREIGN KEY,
  FOREIGN KEY (customerNumber) REFERENCES customers(customerNumber)
);
```

### Products Table
```sql
CREATE TABLE products (
  productCode VARCHAR(20) PRIMARY KEY,
  productName VARCHAR(100),
  productLine VARCHAR(50),
  quantityInStock INT,
  buyPrice DECIMAL(10,2),
  MSRP DECIMAL(10,2)
);
```

### OrderDetails Table
```sql
CREATE TABLE orderdetails (
  orderNumber INT,
  productCode VARCHAR(20),
  quantityOrdered INT,
  priceEach DECIMAL(10,2),
  PRIMARY KEY (orderNumber, productCode),
  FOREIGN KEY (orderNumber) REFERENCES orders(orderNumber),
  FOREIGN KEY (productCode) REFERENCES products(productCode)
);
```

---

## 🔧 Configuration Files

### .env (Backend Configuration)
```env
# Database Connection
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=classicmodels

# Server
PORT=5000
```

### tsconfig.json (TypeScript Configuration)
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Decorator support enabled

### package.json (Dependencies)
- **express**: Web framework
- **typeorm**: ORM
- **mysql2**: MySQL driver
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **typescript**: Language
- **ts-node**: TypeScript executor

---

## 📝 Coding Conventions

### File Naming
- Entities: `PascalCase.ts` (Customer.ts)
- Services: `PascalCase` with Service suffix (SearchService.ts)
- Controllers: `PascalCase` with Controller suffix (SearchController.ts)
- Routes: `lowercase.ts` (search.ts, statistics.ts)

### Class Naming
- `PascalCase`: Customer, Order, SearchService, SearchController

### Method Naming
- `camelCase`: searchCustomers(), getStatisticsByTime()

### Variable Naming
- `camelCase`: customerKeyword, totalAmount

---

## 🔄 Request/Response Flow Example

### Example: Search Customers

**1. Frontend sends request:**
```javascript
fetch('/api/search/customers?keyword=USA')
```

**2. Route receives:**
```typescript
router.get('/customers', (req, res) => 
  searchController.searchCustomers(req, res)
)
```

**3. Controller processes:**
```typescript
async searchCustomers(req: Request, res: Response) {
  const keyword = req.query.keyword as string;
  const data = await searchService.searchCustomers(keyword);
  res.json({ success: true, data });
}
```

**4. Service queries database:**
```typescript
async searchCustomers(keyword: string) {
  return await this.customerRepository.find({
    where: { customerName: Like(`%${keyword}%`) }
  });
}
```

**5. TypeORM generates SQL:**
```sql
SELECT * FROM customers 
WHERE customerName LIKE '%USA%'
```

**6. Frontend receives response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

## 🚀 Deployment Notes

### Frontend Deployment
- Static files: HTML, CSS, JavaScript
- Can be deployed to: GitHub Pages, Netlify, Vercel, AWS S3
- Update API_BASE URL for production

### Backend Deployment
- Node.js server: Needs Node.js runtime
- Can be deployed to: Heroku, AWS EC2, DigitalOcean, Render
- Environment variables must be set in production

---

## 📚 Resources

- [Express Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

**Last Updated:** April 2026
