# 📊 Classicmodels - Website Tìm kiếm & Thống kê

Ứng dụng web đơn giản để tìm kiếm, thống kê và phân tích dữ liệu từ CSDL Classicmodels sử dụng:
- **Backend**: Node.js + Express + TypeORM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Chart.js
- **Database**: MySQL Classicmodels

## 🚀 Tính năng

### 1. 🔍 Tìm kiếm
- Tìm kiếm khách hàng (theo tên, thành phố, quốc gia)
- Tìm kiếm sản phẩm (theo tên, dòng sản phẩm)
- Tìm kiếm đơn hàng theo ngày
- Tìm kiếm tổng hợp

### 2. 📈 Thống kê
- Thống kê theo khách hàng (số đơn, tổng doanh thu, tổng số lượng)
- Thống kê theo thời gian (doanh thu theo tháng/năm)
- Thống kê theo sản phẩm (doanh thu, số lượng bán)
- Top 10 khách hàng
- Top 10 sản phẩm bán chạy

### 3. 📊 Biểu đồ
- Biểu đồ cột: Doanh thu Top 10 khách hàng
- Biểu đồ tròn: Lượng bán Top 10 sản phẩm
- Biểu đồ đường: Doanh thu theo tháng
- Biểu đồ tròn: Doanh thu theo dòng sản phẩm

### 4. 🔄 Bảng Pivot
- Bảng tổng hợp: Khách hàng vs Dòng sản phẩm
- Hiển thị tổng doanh thu cho mỗi kết hợp

## 📋 Yêu cầu

- **Node.js** (phiên bản 14+)
- **npm** hoặc **yarn**
- **MySQL** (Classicmodels database)
- **Trình duyệt web hiện đại**

## 🔧 Cài đặt

### Bước 1: Chuẩn bị CSDL
Đảm bảo CSDL Classicmodels đã được cài đặt trên MySQL:
- Host: `localhost`
- Port: `3307`
- Database: `classicmodels`

Nếu chưa có, có thể download từ: https://www.mysqltutorial.org/mysql-sample-database.aspx

### Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

### Bước 3: Cấu hình kết nối Database

Chỉnh sửa file `.env`:

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=classicmodels
PORT=5000
```

Thay đổi các giá trị tùy theo cấu hình MySQL của bạn:
- `DB_USER`: Username MySQL
- `DB_PASSWORD`: Password MySQL
- `DB_PORT`: Port MySQL (mặc định 3306 hoặc 3307)

### Bước 4: Khởi chạy Backend

```bash
# Development mode (sử dụng ts-node)
npm run dev

# Hoặc Production mode
npm run build
npm start
```

Backend sẽ chạy ở: `http://localhost:5000`

### Bước 5: Mở Frontend

Có 2 cách:

**Cách 1: Mở file trực tiếp (nếu không có server)**
```bash
# Vào thư mục frontend
cd frontend
# Mở file index.html bằng trình duyệt
```

**Cách 2: Sử dụng Live Server (Khuyên dùng)**
- Cài đặt VS Code extension: "Live Server"
- Chuột phải vào `frontend/index.html` → "Open with Live Server"
- Sẽ mở ở: `http://localhost:5500`

Hoặc dùng Python:
```bash
cd frontend
python3 -m http.server 8000
# Truy cập: http://localhost:8000
```

## 📡 API Endpoints

### Tìm kiếm (Search)
```
GET /api/search/customers?keyword=<keyword>
GET /api/search/products?keyword=<keyword>
GET /api/search/orders?startDate=<YYYY-MM-DD>&endDate=<YYYY-MM-DD>
GET /api/search/global?keyword=<keyword>
```

### Thống kê (Statistics)
```
GET /api/statistics/by-customer
GET /api/statistics/by-time
GET /api/statistics/by-product
GET /api/statistics/pivot
GET /api/statistics/top-customers?limit=10
GET /api/statistics/top-products?limit=10
```

## 🏗️ Cấu trúc Project

```
CSDL/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       (Cấu hình TypeORM)
│   │   ├── entities/
│   │   │   ├── Customer.ts
│   │   │   ├── Order.ts
│   │   │   ├── Product.ts
│   │   │   └── OrderDetail.ts
│   │   ├── services/
│   │   │   ├── SearchService.ts
│   │   │   └── StatisticsService.ts
│   │   ├── controllers/
│   │   │   ├── SearchController.ts
│   │   │   └── StatisticsController.ts
│   │   ├── routes/
│   │   │   ├── search.ts
│   │   │   └── statistics.ts
│   │   └── main.ts               (Entry point)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                      (Cấu hình database)
├── frontend/
│   ├── index.html                (Giao diện chính)
│   ├── style.css                 (Styling)
│   └── script.js                 (Logic & API calls)
└── README.md
```

## 🔗 ORM & TypeORM

Dự án sử dụng **TypeORM** để quản lý CSDL:

### Lợi ích:
- ✅ Type-safe queries với TypeScript
- ✅ Tự động map dữ liệu từ database sang entity classes
- ✅ Hỗ trợ query builder cho complex queries
- ✅ Relationship management

### Entities được định nghĩa:
- **Customer**: Thông tin khách hàng
- **Order**: Đơn hàng
- **Product**: Sản phẩm
- **OrderDetail**: Chi tiết đơn hàng

## 🎯 Cách sử dụng

### 1️⃣ Tìm kiếm Khách hàng
1. Chuyển sang tab "🔍 Tìm kiếm"
2. Nhập tên khách hàng, thành phố hoặc quốc gia
3. Nhấn "Tìm kiếm"
4. Xem kết quả trong bảng

### 2️⃣ Xem Thống kê
1. Chuyển sang tab "📈 Thống kê"
2. Chọn một trong các thống kê:
   - Top 10 Khách hàng
   - Top 10 Sản phẩm bán chạy
   - Thống kê theo khách hàng
   - Thống kê theo thời gian
   - Thống kê theo sản phẩm
3. Nhấn "Tải dữ liệu"

### 3️⃣ Xem Biểu đồ
1. Chuyển sang tab "📊 Biểu đồ"
2. Các biểu đồ sẽ tự động tải
3. Di chuyển chuột để xem chi tiết

### 4️⃣ Xem Bảng Pivot
1. Chuyển sang tab "🔄 Pivot"
2. Nhấn "Tải dữ liệu Pivot"
3. Xem bảng tổng hợp Khách hàng vs Dòng sản phẩm

## 🐛 Khắc phục sự cố

### Lỗi: "Cannot connect to database"
```
✓ Kiểm tra MySQL service đang chạy
✓ Kiểm tra port MySQL (mặc định 3306 hoặc 3307)
✓ Kiểm tra credentials trong .env
```

### Lỗi: "CORS error"
```
✓ Backend đã include CORS middleware
✓ Nếu vẫn có lỗi, kiểm tra localhost addresses giống nhau
```

### Lỗi: "API không kết nối"
```
✓ Kiểm tra backend đang chạy: http://localhost:5000/api/health
✓ Kiểm tra port trong script.js giống port backend
```

## 📚 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| Express | ^4.18.2 | REST API Framework |
| TypeORM | ^0.3.16 | ORM for database |
| MySQL2 | ^3.6.0 | MySQL driver |
| TypeScript | ^5.1.3 | Type-safe JavaScript |
| Chart.js | 3.9.1 | Data visualization |
| CORS | ^2.8.5 | Cross-origin requests |

## 💡 Mở rộng thêm

### Thêm chức năng mới:
1. **Export to Excel**: Xuất dữ liệu ra file Excel
2. **Filters nâng cao**: Lọc theo multiple fields
3. **Real-time updates**: WebSocket cho real-time data
4. **Authentication**: Thêm login/logout
5. **Dashboard**: Trang chủ với KPI chính

### Cải thiện UI/UX:
1. Thêm loading animations
2. Improve responsive design
3. Dark mode
4. More chart types

## 📝 License

Free to use for educational purposes

## 👨‍💻 Author

Created for learning TypeORM and REST API development

---

**Chúc bạn thành công! 🎉**
