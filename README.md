#  SimpleERP — Hệ Thống Quản Trị Doanh Nghiệp Nội Bộ

> **Sinh viên thực hiện**: Nguyễn Tiến Thắng  
> **Nền tảng**: Angular 19 (Frontend SPA) + ASP.NET Core 8 (Backend RESTful API) + Microsoft SQL Server

---

## TÀI KHOẢN TRẢI NGHIỆM HỆ THỐNG

Hệ thống đã được nạp sẵn dữ liệu mẫu (Seeded Data). Quý Thầy Cô và Mentor có thể đăng nhập bằng 2 tài khoản phân quyền:

| Vai trò (Role) | Tên đăng nhập | Mật khẩu | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `lam.nq` | `lam.nq` | Toàn quyền: Xem Dashboard KPI toàn viện, Quản lý Nhân sự, Quản lý Phòng ban, Quản lý Vật tư, Giám sát Chấm công toàn công ty, Phê duyệt Đơn nghỉ phép. |
| **Nhân viên (Employee)** | `thang.nt` | `thang.nt` | Tự phục vụ: Xem thông tin cá nhân, Chấm công 1-chạm (Check-in/Check-out), Xem lịch sử công của mình, Tạo đơn xin nghỉ phép & theo dõi trạng thái duyệt. |

---

## NGĂN XẾP CÔNG NGHỆ

| Thành phần | Công nghệ / Thư viện | Vai trò kỹ thuật trong hệ thống |
| :--- | :--- | :--- |
| **Frontend** | **Angular 19** (Standalone Components) | Giao diện SPA, sử dụng cú pháp mới `@if`, `@for`, bỏ `NgModule` cồng kềnh. |
| **Quản lý Trạng thái** | **Angular Signals & Computed** | Quản lý state nhẹ, phản xạ trực tiếp (Fine-grained reactivity), tự động tính toán KPI. |
| **Form & Validation** | **Reactive Forms** | Bắt lỗi trực tiếp phía client, custom validator `pastDateValidator`. |
| **Giao tiếp Mạng** | **HttpClient + HttpInterceptor** | Tự gắn Bearer Token, cơ chế Silent Refresh Token khi gặp lỗi 401, bắt lỗi 403 & 500 toàn cục. |
| **Backend API** | **ASP.NET Core 8 Web API** (C# 12) | Xây dựng theo Clean Layered Architecture (API, Core, Infrastructure, Shared). |
| **Kiến trúc Mã nguồn** | **Repository Pattern** | Tách rời nghiệp vụ truy vấn CSDL khỏi Controller, hỗ trợ mở rộng và Unit Test. |
| **Cơ sở dữ liệu** | **Microsoft SQL Server** + **EF Core 8** | Tối ưu hóa truy vấn bằng `IQueryable`, phân trang `Skip/Take` ở Database. |
| **Bảo mật & Xác thực** | **BCrypt.Net** + **JWT (JSON Web Token)** | Băm mật khẩu có Salt, cấp Access Token (2h) và Refresh Token (7d) ký HMAC-SHA256. |

---

## CÁC TÍNH NĂNG 

### 1. Bảng điều khiển
- Các thẻ KPI (Tổng nhân viên, Đang làm việc, Đang nghỉ phép, Tổng phòng ban, Tổng tài sản) tự động nhảy số thời gian thực bằng `computed()` Signals.
- Tích hợp Widget Chấm công 1-chạm trực tiếp trên Dashboard kèm đồng hồ thời gian thực và lời chào buổi sáng/chiều.

### 2. Quản lý Nhân sự
- **Thuật toán Tự sinh Mã nhân viên**: Format `NV_{STT}_{ChữCáiĐầu}` (Ví dụ: "Nguyễn Tiến Thắng" $\rightarrow$ `NV_15_NTT`).
- **Chống trùng lặp mã (Collision Prevention)**: Vòng lặp `while (AnyAsync)` trong DB đảm bảo mã duy nhất 100%.
- **Tự động cấp tài khoản**: Sinh `Username`, `Email` công ty và mật khẩu mặc định băm bằng `BCrypt`.
- **Xóa mềm (Soft Delete)**: Cập nhật cờ `IsDeleted = true` để giữ trọn vẹn lịch sử chấm công, phân bổ tài sản.
- **Phân trang số 1-2-3**: Phân trang chuẩn Database (`Skip/Take`) với các nút chuyển trang trực quan.

### 3. Quản lý Phòng ban & Ràng buộc toàn vẹn dữ liệu
- CRUD đầy đủ thông tin phòng ban.
- **Ràng buộc an toàn dữ liệu**: Kiểm tra bằng `AnyAsync` — Chặn không cho xóa phòng ban nếu đang còn nhân viên hoặc tài sản trực thuộc.

### 4. Quản lý Vật tư & Thiết bị
- Theo dõi vòng đời tài sản (Đang sử dụng, Sẵn sàng cấp phát, Đang bảo trì, Hỏng).
- Lọc theo phòng ban và tìm kiếm theo tên/mã ở phía Server.
- **Phân trang máy chủ số 1-2-3**: Trả về `PagedResultDTO<AssetDTO>`, tối ưu RAM máy chủ.

### 5. Quản lý Chấm công thông minh
- **Quy tắc mốc 8:15 AM**: Check-in sau 08:15:00 tự động gắn trạng thái `Late` (Đi muộn), trước 08:15:00 là `OnTime` (Đúng giờ).
- **Triệt tiêu chấm công hộ**: Backend tự động trích xuất `EmployeeId` từ JWT Token của người đăng nhập, không nhận ID từ client gửi lên.
- **Chống chấm công đè**: Chặn check-in 2 lần trong cùng một ngày.
- **IQueryable**: Cho phép Admin lọc đồng thời Phòng ban + Trạng thái + Ngày + Tên nhân viên.

### 6. Quy trình Phê duyệt Nghỉ phép 
- Quy trình phê duyệt 2 chiều giữa Nhân viên và Quản trị viên (`Pending` $\rightarrow$ `Approved` / `Rejected`).
- **Cơ chế Bảo vệ 2 lớp chống xóa bậy (Two-Layer Security)**:
  - *Lớp 1 (UI)*: Ẩn nút Hủy khi đơn đã được duyệt bằng `@if (req.status === 'Pending')`.
  - *Lớp 2 (API)*: Backend kiểm tra lại trong DB, quăng lỗi `400 Bad Request` nếu đơn không còn ở trạng thái `Pending`.

---

## HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCALHOST

### 1. Yêu cầu môi trường
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/) 
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) 

### 2. Khởi chạy Backend (.NET 8 Web API)
```bash
cd Backend/SimpleERP.API
dotnet run
# Máy chủ API sẽ lắng nghe tại: http://localhost:5000
# Xem tài liệu API Swagger tại: http://localhost:5000/swagger
```
*(Hệ thống sẽ tự động tạo cơ sở dữ liệu và seed sẵn dữ liệu mẫu trong lần chạy đầu tiên)*

### 3. Khởi chạy Frontend (Angular 19)
```bash
cd Frontend/erp-client
npm install
npm start
# Ứng dụng chạy tại: http://localhost:4200
```

---

## CẤU TRÚC THƯ MỤC DỰ ÁN

```
SimpleERP/
├── Backend/
│   ├── SimpleERP.API/              ← Controllers, Program.cs, Middleware
│   ├── SimpleERP.Core/             ← Entities (Bảng CSDL), Interfaces
│   ├── SimpleERP.Infrastructure/   ← DbContext, Repositories, DatabaseSeeder
│   └── SimpleERP.Shared/           ← DTOs, PagedResultDTO, Helpers
├── Frontend/
│   └── erp-client/
│       └── src/app/
│           ├── hr-dashboard/       ← Component Bảng điều khiển KPI
│           ├── pages/              ← Employee, Department, Asset, Attendance, Leave
│           ├── services/           ← Auth, Employee, Asset, Attendance, Leave Service
│           ├── interceptors/       ← AuthInterceptor (JWT), ErrorInterceptor
│           ├── guards/             ← AuthGuard, RoleGuard
│           └── store/              ← EmployeeStateService (Angular Signals)
└── README.md
```

---

## 📅 TIẾN ĐỘ HOÀN THÀNH (14 TUẦN THỰC TẬP)

-  **Tuần 1 - 4**: Nghiên cứu yêu cầu nghiệp vụ ERP, thiết kế CSDL SQL Server, dựng khung Clean Architecture .NET 8.
-  **Tuần 5 - 8**: Triển khai tầng bảo mật Authentication (BCrypt + JWT + Refresh Token), xây dựng CRUD Phòng ban & Nhân sự (tự sinh mã, xóa mềm).
-  **Tuần 9 - 11**: Phát triển phân hệ Chấm công (quy tắc 8:15 AM, chống chấm công hộ) & Quy trình Nghỉ phép (bảo vệ 2 lớp).
-  **Tuần 12**: Xây dựng Quản lý Vật tư & Thiết bị, hoàn thiện HR Dashboard KPI với Angular Signals.
-  **Tuần 13**: Tối ưu hóa hiệu năng: Phân trang máy chủ chuẩn `IQueryable` có các nút số `[1][2][3]` cho Nhân sự & Vật tư.
-  **Tuần 14**: Kiểm thử toàn diện, bảo vệ Responsive di động, hoàn thiện tài liệu báo cáo tốt nghiệp.
