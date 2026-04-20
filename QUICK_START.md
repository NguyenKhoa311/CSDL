# 🚀 Hướng dẫn Khởi chạy Nhanh

## ⏱️ 5 phút để chạy ứng dụng

### Bước 1: Kiểm tra MySQL
```bash
# Mở terminal, kiểm tra MySQL đang chạy trên port 3307
mysql -h localhost -P 3307 -u root
```

Nếu kết nối thành công, nhập lệnh kiểm tra database:
```sql
USE classicmodels;
SHOW TABLES;
```

### Bước 2: Cài đặt Backend
```bash
cd /Users/hoangnv/Desktop/CSDL/backend
npm install
```

### Bước 3: Chạy Backend
```bash
npm run dev
```

Bạn sẽ thấy:
```
Database connected successfully!
Server is running on http://localhost:5000
```

### Bước 4: Mở Frontend

**Option A: Dùng Live Server (VS Code)**
1. Chuột phải vào file `frontend/index.html`
2. Chọn "Open with Live Server"

**Option B: Dùng Python**
```bash
cd /Users/hoangnv/Desktop/CSDL/frontend
python3 -m http.server 8000
```
Rồi mở browser: `http://localhost:8000`

**Option C: Mở trực tiếp**
- Chuột phải vào `index.html` → "Open with → Browser"

## ✅ Kiểm tra kết nối

Mở browser tab mới, truy cập:
```
http://localhost:5000/api/health
```

Bạn sẽ thấy:
```json
{"status":"OK","message":"API is running"}
```

## 🎯 Test các chức năng

### 1. Test Tìm kiếm
1. Vào tab "🔍 Tìm kiếm"
2. Nhập "USA" vào "Tìm kiếm khách hàng"
3. Nhấn nút "Tìm kiếm"

### 2. Test Thống kê
1. Vào tab "📈 Thống kê"
2. Chọn "Top 10 Khách hàng"
3. Nhấn "Tải dữ liệu"

### 3. Test Biểu đồ
1. Vào tab "📊 Biểu đồ"
2. Các biểu đồ sẽ tự động tải

## 🔧 Troubleshooting

| Vấn đề | Giải pháp |
|--------|----------|
| "Cannot GET /api/health" | Chạy lại `npm run dev` ở terminal backend |
| Database connection error | Kiểm tra .env file, user/password MySQL |
| CORS error | Kiểm tra backend đang chạy trên port 5000 |
| Blank page | Kiểm tra console (F12) xem lỗi gì |

## 📝 File cấu hình

File `.env` ở `backend/`:
```env
DB_HOST=localhost      # MySQL host
DB_PORT=3307          # MySQL port (thay đổi nếu cần)
DB_USER=root          # MySQL username
DB_PASSWORD=          # MySQL password (nếu có)
DB_NAME=classicmodels # Database name
PORT=5000             # Backend port
```

## 📚 API Endpoints Chính

```
# Tìm kiếm
GET http://localhost:5000/api/search/customers?keyword=USA
GET http://localhost:5000/api/search/products?keyword=car

# Thống kê
GET http://localhost:5000/api/statistics/top-customers?limit=10
GET http://localhost:5000/api/statistics/top-products?limit=10
GET http://localhost:5000/api/statistics/pivot

# Kiểm tra
GET http://localhost:5000/api/health
```

## 🎉 Done!

Nếu mọi thứ hoạt động, bạn đã có một website hoàn chỉnh với:
- ✅ Search functionality
- ✅ Statistics & Analytics
- ✅ Charts & Visualization
- ✅ Pivot tables
- ✅ RESTful API
- ✅ ORM (TypeORM)

Chúc mừng! 🚀

---

**Cần giúp?** Xem `README.md` để tìm hiểu thêm chi tiết.
