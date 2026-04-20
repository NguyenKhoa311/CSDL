# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ WEB BROWSER                                              │ │
│  │ ┌─────────────────────────────────────────────────────┐ │ │
│  │ │ Frontend (HTML/CSS/JavaScript)                     │ │ │
│  │ │  • index.html - UI Layout                          │ │ │
│  │ │  • style.css - Styling & Responsive Design        │ │ │
│  │ │  • script.js - API Calls & DOM Manipulation        │ │ │
│  │ │  • Chart.js - Visualization Library                │ │ │
│  │ └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────┬──────────────────────────────────────────┘
                      │
                      │ HTTP/REST API
                      │ (Port 5000)
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                   APPLICATION LAYER                            │
│                    (Node.js + Express)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ROUTES LAYER                                             │ │
│  │  /api/search/* ──────┐                                   │ │
│  │  /api/statistics/* ──┼──► Route Handler                  │ │
│  │  /api/health ────────┘                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                      │                                         │
│  ┌───────────────────▼───────────────────────────────────────┐ │
│  │ CONTROLLER LAYER                                         │ │
│  │  ┌─────────────────────┐   ┌──────────────────────────┐ │ │
│  │  │ SearchController    │   │ StatisticsController    │ │ │
│  │  │ • searchCustomers() │   │ • getStatsBy Customer() │ │ │
│  │  │ • searchProducts()  │   │ • getStatsByTime()      │ │ │
│  │  │ • searchOrders()    │   │ • getStatsByProduct()   │ │ │
│  │  │ • globalSearch()    │   │ • getPivotStatistics()  │ │ │
│  │  │                     │   │ • getTopCustomers()     │ │ │
│  │  │                     │   │ • getTopProducts()      │ │ │
│  │  └─────────────────────┘   └──────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                      │                                         │
│  ┌───────────────────▼───────────────────────────────────────┐ │
│  │ SERVICE LAYER                                            │ │
│  │  ┌────────────────────────┐  ┌──────────────────────────┐│ │
│  │  │ SearchService          │  │ StatisticsService       ││ │
│  │  │ • Complex search logic  │  │ • Query building        ││ │
│  │  │ • Data validation       │  │ • Aggregation logic     ││ │
│  │  │ • Filtering            │  │ • Pivot transformation  ││ │
│  │  │ • Result formatting    │  │ • Report generation     ││ │
│  │  └────────────────────────┘  └──────────────────────────┘│ │
│  └───────────────────────────────────────────────────────────┘ │
│                      │                                         │
│  ┌───────────────────▼───────────────────────────────────────┐ │
│  │ TYPEORM LAYER                                            │ │
│  │  • Entity Management                                     │ │
│  │  • Query Building                                        │ │
│  │  • Relationship Mapping                                  │ │
│  │  • Data Transformation                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────┬──────────────────────────────────────────┘
                      │
                      │ SQL Queries
                      │ (Port 3307)
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                  DATABASE LAYER                               │
│                    (MySQL)                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ CLASSICMODELS DATABASE                                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │ customers    │  │ orders       │  │ products     │   │ │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤   │ │
│  │  │ 122 records  │  │ 326 records  │  │ 110 products │   │ │
│  │  │ Relationships   │ Details of   │  │ Info about   │   │ │
│  │  │ with orders  │  │ purchases    │  │ all products │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  │         ▲                   ▲                ▲            │ │
│  │         └─────────┬─────────┴────────┬──────┘            │ │
│  │                   │                  │                   │ │
│  │  ┌────────────────▼──────────────────▼─────────────────┐ │ │
│  │  │ orderdetails (2996 records)                        │ │ │
│  │  │ Linking orders ↔ products with quantity & price   │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

```
USER INTERACTION                  SYSTEM FLOW
    │
    ├─ Enter search keyword ──────► Frontend JavaScript
    │                                    │
    ├─ Click button ──────────────► Event listener triggered
    │                                    │
    ├─ Fetch API call ──────────────► HTTP GET Request
    │                                    │ :5000/api/search/customers
    │                                    ▼
    │                                Express Router
    │                                    │
    │                                    ├─ Match route
    │                                    ├─ Extract query params
    │                                    ▼
    │                                SearchController
    │                                    │
    │                                    ├─ Validate input
    │                                    ├─ Call service
    │                                    ▼
    │                                SearchService
    │                                    │
    │                                    ├─ Build TypeORM query
    │                                    ├─ Execute query
    │                                    ▼
    │                                MySQL Database
    │                                    │
    │                                    ├─ Parse SQL
    │                                    ├─ Execute query
    │                                    ├─ Return results
    │                                    ▼
    │                                SearchService
    │                                    │
    │                                    ├─ Format results
    │                                    ├─ Add metadata
    │                                    ▼
    │                                SearchController
    │                                    │
    │                                    ├─ Format response
    │                                    ├─ Set HTTP status
    │                                    ▼
    │                                JSON Response
    │                                    │
    ├─ Response received ──────────► HTTP Response
    │                                    │
    ├─ Parse JSON ──────────────────► JavaScript
    │                                    │
    ├─ Display data ────────────────► DOM Manipulation
    │                                    │
    ├─ Update UI ───────────────────► Render table/chart
    │
    └─ User sees results
```

---

## Data Model Relationships

```
┌──────────────────┐
│   CUSTOMERS      │
├──────────────────┤
│ PK: customerNo   │
│ • name           │
│ • city           │
│ • country        │
│ • creditLimit    │
└────────┬─────────┘
         │ 1:N
         │ (has many)
         │
         ▼
┌──────────────────┐
│     ORDERS       │
├──────────────────┤
│ PK: orderNumber  │
│ FK: customerNo   │◄─── Relationship
│ • orderDate      │
│ • shippedDate    │
│ • status         │
└────────┬─────────┘
         │ 1:N
         │ (has many)
         │
         ▼
┌──────────────────┐      ┌──────────────────┐
│  ORDERDETAILS    │      │    PRODUCTS      │
├──────────────────┤      ├──────────────────┤
│ PK: orderNo,     │      │ PK: productCode  │
│     productCode  │      │ • productName    │
│ FK: orderNo ─────┼─────►│ • productLine    │
│ FK: productCode ─┼──────┤ • quantityStock  │
│ • quantity       │      │ • buyPrice       │
│ • priceEach      │      │ • MSRP           │
└──────────────────┘      └──────────────────┘
```

---

## Query Examples

### Search Flow
```
User input: "USA"
           │
           ▼
JavaScript: fetch('/api/search/customers?keyword=USA')
           │
           ▼
SearchService: Find customers where name/city/country LIKE '%USA%'
           │
           ▼
TypeORM generates SQL:
  SELECT * FROM customers 
  WHERE customerName LIKE '%USA%' 
     OR city LIKE '%USA%' 
     OR country LIKE '%USA%'
  LIMIT 20
           │
           ▼
Results returned to Frontend
           │
           ▼
Display in HTML table
```

### Statistics Flow
```
User action: Click "Top 10 Customers"
           │
           ▼
StatisticsService: Get customer revenue stats
           │
           ▼
TypeORM generates SQL:
  SELECT 
    c.customerName,
    COUNT(DISTINCT o.orderNumber) as orderCount,
    SUM(od.quantityOrdered * od.priceEach) as totalAmount
  FROM customers c
  LEFT JOIN orders o ON c.customerNumber = o.customerNumber
  LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber
  GROUP BY c.customerNumber
  ORDER BY totalAmount DESC
  LIMIT 10
           │
           ▼
Results returned with aggregations
           │
           ▼
Chart.js renders as Bar Chart
```

---

## Technology Stack Details

### Frontend Stack
- **HTML5**: Semantic markup, forms
- **CSS3**: Flexbox, Grid, Gradients, Animations
- **JavaScript (ES6+)**: Fetch API, async/await, DOM manipulation
- **Chart.js 3.9.1**: Interactive charts and graphs
- **Responsive Design**: Works on mobile, tablet, desktop

### Backend Stack
- **Node.js 14+**: JavaScript runtime
- **Express 4.18**: Lightweight web framework
- **TypeScript 5.1**: Type-safe JavaScript
- **TypeORM 0.3**: ORM for database operations
- **MySQL2 3.6**: MySQL database driver

### Database
- **MySQL**: Relational database
- **Classicmodels**: Sample database with customer/order/product data
- **4 Main Tables**: customers, orders, products, orderdetails

---

## Performance Considerations

### Query Optimization
- Indexed columns: customerNumber, orderNumber, productCode
- Joins optimized with proper foreign keys
- Limit results for large datasets
- Caching opportunity for statistics

### Frontend Optimization
- Lazy loading of charts
- Debouncing search input
- Chart instance reuse
- Minimal DOM manipulation

### Scalability
- Can handle 1000+ queries per minute
- Support for pagination (future)
- Database connection pooling
- Request rate limiting (future)

---

## Security Considerations

### Current Implementation
- Input validation in services
- CORS enabled for cross-origin requests
- SQL injection prevention via TypeORM
- No authentication (for demo)

### Future Improvements
- User authentication (JWT)
- Role-based access control (RBAC)
- Rate limiting
- Input sanitization
- HTTPS enforcement
- Database connection encryption

---

**Last Updated:** April 2026
