# Ứng dụng Quản lý Sách Mini(Book Management Application)

Hệ thống quản lý sách toàn diện tích hợp **React Frontend (Vite)** và **Django REST Framework Backend (PostgreSQL)**. Dự án được thiết kế theo kiến trúc hướng module sạch sẽ với nhiều ứng dụng Django riêng biệt, xác thực JWT, phân trang động, bộ lọc kết hợp debounce tự động tìm kiếm, giỏ hàng và quy trình đặt hàng/xác nhận đơn hàng.

---

## Cấu trúc dự án

Hệ thống được chia nhỏ thành các thành phần độc lập để dễ dàng bảo trì:

*   **be/ (Backend Django):**
    *   `config/`: Cấu hình hệ thống chính (cài đặt, định tuyến, WSGI/ASGI).
    *   `accounts/`: Đăng ký, đăng nhập (JWT token), đăng xuất (blacklist token).
    *   `books/`: Quản lý Sách, Danh mục, phân trang custom và validate.
    *   `cart/`: Quản lý giỏ hàng của từng người dùng.
    *   `orders/`: Xử lý đặt hàng (checkout) và duyệt đơn hàng.
*   **fe/ (Frontend React):**
    *   `src/context/`: Quản lý trạng thái đăng nhập toàn cục (`AuthContext`).
    *   `src/pages/`: Các trang giao diện chính (`BooksPage`, `CartPage`, `OrderPage`, `LoginPage`, `RegisterPage`).
    *   `src/components/`: Các thành phần tái sử dụng (`BookTable`, `BookModal`, `CategoryModal`, `FilterBar`, `Pagination`).
    *   `src/api/`: Các tệp giao tiếp gọi API Backend.

---

## Cài đặt & Khởi chạy

### 1. Khởi động Backend (Django)

1.  **Cài đặt thư viện:**
    Di chuyển vào thư mục backend và cài đặt các dependencies:
    ```bash
    cd be
    pip install -r requirements.txt
    ```
2.  **Cấu hình biến môi trường:**
    Tạo tệp `.env` trong thư mục `be/` (sao chép từ `.env.example`):
    ```env
    SECRET_KEY=your-django-secret-key
    DATABASE_URL=postgresql://username:password@localhost:5432/django_book_manage
    ```
3.  **Đồng bộ Cơ sở dữ liệu:**
    Chạy lệnh tạo bảng trong PostgreSQL:
    ```bash
    python manage.py migrate
    ```
4.  **Seed dữ liệu mẫu:**
    Để tạo sẵn dữ liệu sách, danh mục và tài khoản thử nghiệm nhanh, hãy chạy script:
    ```bash
    python seed_data.py  # (Nằm trong thư mục chứa file seed hoặc chạy trực tiếp bằng python)
    ```

5.  **Chạy server phát triển:**
    ```bash
    python manage.py runserver
    ```
    *Backend sẽ khởi chạy tại: `http://127.0.0.1:8000/`*

---

### 2. Khởi động Frontend (React)

1.  **Cài đặt packages:**
    ```bash
    cd fe
    npm install
    ```
2.  **Chạy ứng dụng:**
    ```bash
    npm run dev
    ```
    *Frontend sẽ khởi chạy tại: `http://localhost:5173/`*

---

## 🔑 Tài khoản thử nghiệm (Sau khi Seed)

| Loại tài khoản | Username | Password | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Thêm, sửa, xóa sách & danh mục; xác nhận đơn hàng; xem mọi đơn hàng. |
| **User thường** | `acer` | `acer123` | Xem sách, tìm kiếm, thêm sách vào giỏ hàng, đặt hàng và xem đơn hàng của mình. |

---

## 📡 Danh sách API Endpoints chính

### 1. Xác thực & Tài khoản (`accounts/`)
*   `POST /api/token/`: Đăng nhập lấy cặp Access & Refresh Token.
*   `POST /api/token/refresh/`: Làm mới Access Token hết hạn.
*   `POST /api/register/`: Đăng ký tài khoản người dùng mới.
*   `POST /api/logout/`: Đăng xuất (Vô hiệu hóa Refresh Token).

### 2. Sách & Danh mục (`books/`)
*   `GET /api/books/`: Xem danh sách sách (Hỗ trợ phân trang `?page_size=20` & lọc `?title=...&author=...&min_price=...`).
*   `POST /api/books/`: Thêm sách mới *(Chỉ Admin)*.
*   `GET/PUT/PATCH/DELETE /api/books/<id>/`: Xem chi tiết, cập nhật hoặc xóa sách.
*   `GET/POST/PUT/PATCH/DELETE /api/categories/`: CRUD danh mục sách *(CRUD yêu cầu Admin, Xem yêu cầu Đã đăng nhập)*.

### 3. Giỏ hàng (`cart/`)
*   `GET /api/cart/`: Xem các mặt hàng trong giỏ.
*   `POST /api/cart/`: Thêm sách vào giỏ (`book_id`).
*   `DELETE /api/cart/<book_id>/`: Xóa sách khỏi giỏ hàng.

### 4. Đơn hàng (`orders/`)
*   `GET /api/orders/`: Xem lịch sử đơn hàng (User chỉ xem đơn của mình, Admin xem toàn bộ).
*   `POST /api/orders/`: Checkout (tạo đơn hàng từ giỏ hàng và xóa giỏ).
*   `GET /api/orders/<id>/`: Xem chi tiết một đơn hàng.
*   `PATCH /api/orders/<id>/confirm/`: Xác nhận duyệt đơn hàng *(Chỉ Admin)*.