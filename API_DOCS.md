# 📡 API Documentation

## Base URL
```
http://localhost:5000/api
```

## 🔍 Search Endpoints

### 1. Search Customers
**Endpoint:** `GET /search/customers`

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| keyword | string | Yes | Tìm kiếm theo tên, thành phố, quốc gia |

**Example:**
```bash
GET /api/search/customers?keyword=USA
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "customerNumber": 103,
      "customerName": "Atelier graphique",
      "city": "Paris",
      "country": "France",
      "phone": "40.32.2555"
    }
  ]
}
```

---

### 2. Search Products
**Endpoint:** `GET /search/products`

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| keyword | string | Yes | Tìm kiếm theo tên hoặc dòng sản phẩm |

**Example:**
```bash
GET /api/search/products?keyword=car
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productCode": "S10_1678",
      "productName": "1969 Harley Davidson Ultimate Chopper",
      "productLine": "Motorcycles",
      "buyPrice": 48.81,
      "MSRP": 95.70
    }
  ]
}
```

---

### 3. Search Orders by Date
**Endpoint:** `GET /search/orders`

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| startDate | date | No | Ngày bắt đầu (YYYY-MM-DD) |
| endDate | date | No | Ngày kết thúc (YYYY-MM-DD) |
| customerNumber | number | No | Mã khách hàng |

**Example:**
```bash
GET /api/search/orders?startDate=2003-01-01&endDate=2003-12-31
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "orderNumber": 10100,
      "orderDate": "2003-01-06",
      "status": "Shipped",
      "customer": {
        "customerNumber": 103,
        "customerName": "Atelier graphique"
      }
    }
  ]
}
```

---

### 4. Global Search
**Endpoint:** `GET /search/global`

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| keyword | string | Yes | Từ khóa tìm kiếm |

**Example:**
```bash
GET /api/search/global?keyword=USA
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [...],
    "products": [...],
    "total": 15
  }
}
```

---

## 📈 Statistics Endpoints

### 1. Statistics by Customer
**Endpoint:** `GET /statistics/by-customer`

**Description:** Thống kê doanh thu, số đơn hàng theo khách hàng

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "customerNumber": 141,
      "customerName": "Euro+ Shopping Channel",
      "orderCount": "30",
      "totalAmount": "715738.98",
      "totalQuantity": "6066"
    }
  ]
}
```

---

### 2. Statistics by Time (Monthly)
**Endpoint:** `GET /statistics/by-time`

**Description:** Thống kê doanh thu theo tháng/năm

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "year": 2003,
      "month": 1,
      "orderCount": "10",
      "totalAmount": "123456.78"
    }
  ]
}
```

---

### 3. Statistics by Product
**Endpoint:** `GET /statistics/by-product`

**Description:** Thống kê doanh thu, số lượng bán theo sản phẩm

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productCode": "S10_1949",
      "productName": "1952 Alpine Renault 1300",
      "productLine": "Classic Cars",
      "orderCount": "2",
      "totalQuantity": "25",
      "totalAmount": "4502.40",
      "avgPrice": "180.10"
    }
  ]
}
```

---

### 4. Top Customers
**Endpoint:** `GET /statistics/top-customers`

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 10 | Số lượng khách hàng |

**Example:**
```bash
GET /api/statistics/top-customers?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "customerNumber": 141,
      "customerName": "Euro+ Shopping Channel",
      "country": "France",
      "totalAmount": "715738.98"
    }
  ]
}
```

---

### 5. Top Products
**Endpoint:** `GET /statistics/top-products`

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 10 | Số lượng sản phẩm |

**Example:**
```bash
GET /api/statistics/top-products?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productCode": "S10_1949",
      "productName": "1952 Alpine Renault 1300",
      "totalQuantity": "8484",
      "totalAmount": "1619032.80"
    }
  ]
}
```

---

### 6. Pivot Statistics
**Endpoint:** `GET /statistics/pivot`

**Description:** Bảng Pivot - Khách hàng vs Dòng sản phẩm

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "customerName": "Alpha Cognac",
      "productLine": "Classic Cars",
      "totalAmount": "142500.00"
    },
    {
      "customerName": "Alpha Cognac",
      "productLine": "Motorcycles",
      "totalAmount": "85000.00"
    }
  ]
}
```

---

## 🏥 Health Check

### Status Endpoint
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "message": "API is running"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Messages
| Code | Message | Cause |
|------|---------|-------|
| 400 | "Keyword is required" | Từ khóa tìm kiếm không được cung cấp |
| 400 | "Invalid date format" | Định dạng ngày không hợp lệ |
| 500 | "Database error" | Lỗi kết nối database |
| 500 | "Server error" | Lỗi server |

---

## 📊 Data Types

### Customer Object
```json
{
  "customerNumber": 103,
  "customerName": "Atelier graphique",
  "contactLastName": "Schmitt",
  "contactFirstName": "Carine",
  "phone": "40.32.2555",
  "addressLine1": "54, rue Royale",
  "city": "Paris",
  "country": "France",
  "creditLimit": 21000
}
```

### Order Object
```json
{
  "orderNumber": 10100,
  "orderDate": "2003-01-06",
  "requiredDate": "2003-01-13",
  "shippedDate": "2003-01-10",
  "status": "Shipped",
  "customerNumber": 103
}
```

### Product Object
```json
{
  "productCode": "S10_1678",
  "productName": "1969 Harley Davidson Ultimate Chopper",
  "productLine": "Motorcycles",
  "productScale": "1:10",
  "productVendor": "Min Lin Diecast",
  "quantityInStock": 7933,
  "buyPrice": 48.81,
  "MSRP": 95.70
}
```

### OrderDetail Object
```json
{
  "orderNumber": 10100,
  "productCode": "S18_1749",
  "quantityOrdered": 30,
  "priceEach": 136.00,
  "orderLineNumber": 3
}
```

---

## 🔐 CORS Configuration

API hỗ trợ CORS từ mọi origin:
```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 📝 Usage Examples

### cURL
```bash
# Tìm kiếm khách hàng
curl "http://localhost:5000/api/search/customers?keyword=USA"

# Lấy top 10 khách hàng
curl "http://localhost:5000/api/statistics/top-customers?limit=10"

# Lấy thống kê theo thời gian
curl "http://localhost:5000/api/statistics/by-time"
```

### JavaScript/Fetch
```javascript
// Tìm kiếm sản phẩm
fetch('http://localhost:5000/api/search/products?keyword=car')
  .then(res => res.json())
  .then(data => console.log(data));

// Lấy bảng pivot
fetch('http://localhost:5000/api/statistics/pivot')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Python/Requests
```python
import requests

# Tìm kiếm khách hàng
response = requests.get(
    'http://localhost:5000/api/search/customers',
    params={'keyword': 'USA'}
)
data = response.json()
print(data)
```

---

**API Version:** 1.0.0
**Last Updated:** 2024
