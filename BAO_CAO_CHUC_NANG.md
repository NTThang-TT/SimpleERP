# 📋 BÁO CÁO CÁC CHỨC NĂNG ĐÃ HOÀN THIỆN — DỰ ÁN SIMPLEERP

* **Người thực hiện**: Nguyễn Tiến Thắng
* **Dự án**: SimpleERP (Hệ thống Quản trị Doanh nghiệp Nội bộ)
* **Kho mã nguồn GitHub**: [https://github.com/NTThang-TT/SimpleERP](https://github.com/NTThang-TT/SimpleERP)
* **Công nghệ cốt lõi**: Angular 19 (Signals) + .NET 8 Web API (Clean Architecture) + SQL Server (EF Core 8)

---

## 🔑 1. THÔNG TIN TÀI KHOẢN TEST HỆ THỐNG

Hệ thống phân quyền rõ rệt thành 2 vai trò. Anh có thể dùng 2 tài khoản sau để kiểm tra toàn bộ luồng nghiệp vụ:

| Vai trò | Tên đăng nhập | Mật khẩu | Phạm vi quyền hạn thực tế |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `lam.nq` | `lam.nq` | Toàn quyền: Xem KPI toàn công ty, Thêm/Sửa/Xóa Nhân sự, Phòng ban, Vật tư, Giám sát chấm công toàn viện, Phê duyệt đơn nghỉ phép. |
| **Nhân viên (Employee)** | `thang.nt` | `thang.nt` | Tự phục vụ: Chấm công cá nhân (Check-in/Out), Xem bảng công của mình, Tạo đơn xin nghỉ phép và theo dõi trạng thái. ❌ *Bị ẩn toàn bộ menu quản trị*. |

---

## 💻 2. CHI TIẾT TỪNG PHÂN HỆ CHỨC NĂNG & CÁCH XỬ LÝ KỸ THUẬT

---

### PHÂN HỆ 1: ĐĂNG NHẬP, BẢO MẬT & PHÂN QUYỀN

#### 📌 Chức năng làm được:
* Đăng nhập xác thực tài khoản, bắt lỗi sai thông tin trực quan.
* Đăng xuất xóa sạch phiên làm việc trên trình duyệt.
* Tự động điều hướng theo quyền: Admin thấy đầy đủ menu quản trị, Employee chỉ thấy các mục cá nhân.
* **Chặn vượt quyền**: Nhân viên cố tình gõ link `/employees` trên thanh địa chỉ sẽ bị chặn đứng và đá về Dashboard.

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Mã hóa mật khẩu**: Dùng thư viện `BCrypt.Net-Next`. Mật khẩu băm một chiều với Salt ngẫu nhiên trước khi lưu Database. Khi đăng nhập dùng `BCrypt.Verify()` so sánh.
* **Cấp Token JWT**: Dùng thư viện `System.IdentityModel.Tokens.Jwt` sinh Access Token (sống 2 giờ) chứa Claims (`Id`, `Role`, `Name`), ký bằng thuật toán `HMAC-SHA256`. Refresh Token sống 7 ngày lưu trong SQL Server.
* **Tự động gắn Token & Silent Refresh**: Tại file `Frontend/.../auth.interceptor.ts`:
  * Tự gắn Header `Authorization: Bearer <token>` vào mọi request gửi lên server.
  * Nếu gặp lỗi `401 Unauthorized` (Token hết hạn), Interceptor tự động gọi ngầm API `/api/auth/refresh-token` để lấy token mới và tự gọi lại request cũ, người dùng không bị văng ra trang đăng nhập.
  * Nếu gặp lỗi `403 Forbidden` (vượt quyền), hiển thị thông báo cấm truy cập.
* **Vị trí code**:
  * Backend: `SimpleERP.API/Controllers/AuthController.cs`
  * Frontend: `erp-client/src/app/interceptors/auth.interceptor.ts`, `auth.guard.ts`, `role.guard.ts`

---

### PHÂN HỆ 2: BẢNG ĐIỀU KHIỂN (HR DASHBOARD)

#### 📌 Chức năng làm được:
* Thống kê KPI tổng quan: Tổng nhân sự, Nhân viên đang làm việc, Đang nghỉ phép, Tổng phòng ban, Tổng tài sản.
* Widget Chấm công 1-chạm: Hiển thị đồng hồ thời gian thực (nhảy từng giây), lời chào buổi sáng/chiều, nút Check-in/Check-out tự đổi trạng thái.

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Angular 19 Signals & Computed**:
  * Thay vì dùng NgRx nặng nề, sử dụng `signal()` chứa dữ liệu gốc từ API và `computed()` để tự động tính toán tổng số nhân viên hoạt động/nghỉ phép.
  * Khi API trả về dữ liệu mới, các con số trên thẻ KPI tự động nhảy số theo thời gian thực, không cần F5.
* **Custom Validator (`pastDateValidator`)**: Bắt lỗi form Reactive Forms, không cho chọn ngày trong quá khứ khi chọn lịch.
* **Vị trí code**:
  * Frontend: `erp-client/src/app/hr-dashboard/hr-dashboard.component.ts`
  * Store State: `erp-client/src/app/store/employee.state.ts`

---

### PHÂN HỆ 3: QUẢN LÝ NHÂN SỰ (EMPLOYEE)

#### 📌 Chức năng làm được:
* Xem danh sách nhân viên có **thanh phân trang số 1-2-3** và nút "Trước" / "Sau".
* Tìm kiếm nhân sự theo tên hoặc mã nhân viên.
* Lọc nhân sự theo phòng ban.
* Thêm mới nhân viên: Form nhập liệu đầy đủ thông tin cá nhân, chức vụ, phòng ban.
* Xóa nhân viên khỏi danh sách.

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Thuật toán tự sinh Mã nhân viên**: Người dùng không cần gõ mã. Backend tự phân tích Họ và Tên, lấy các chữ cái đầu viết tắt ghép với số thứ tự: `NV_{STT}_{ChữCáiĐầu}` (VD: "Nguyễn Tiến Thắng" $\rightarrow$ `NV_15_NTT`).
* **Vòng lặp chống trùng mã (Collision Check)**: Backend chạy vòng lặp `while (await _context.Employees.AnyAsync(e => e.EmployeeCode == code))` để đảm bảo mã sinh ra là duy nhất 100%.
* **Tự cấp tài khoản mặc định**: Tự sinh Username (`thang.nt`), Email (`thang.nt@company.com`) và mật khẩu mặc định băm BCrypt (`123456`).
* **Xóa mềm (Soft Delete)**: Khi bấm Xóa, Backend cập nhật cờ `IsDeleted = true` chứ không dùng lệnh `DELETE` trong SQL. Giúp giữ nguyên toàn bộ lịch sử chấm công và phân bổ tài sản trong quá khứ, không gây lỗi khóa ngoại.
* **Vị trí code**:
  * Backend: `SimpleERP.Infrastructure/Repositories/EmployeeRepository.cs`, `SimpleERP.API/Controllers/EmployeeController.cs`
  * Frontend: `erp-client/src/app/pages/employee/employee-list.component.ts`

---

### PHÂN HỆ 4: QUẢN LÝ PHÒNG BAN (DEPARTMENT)

#### 📌 Chức năng làm được:
* Xem danh sách tất cả các phòng ban trong công ty.
* Thêm mới phòng ban, Chỉnh sửa thông tin/mô tả phòng ban.
* Xóa phòng ban.

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Ràng buộc an toàn dữ liệu CSDL**:
  * Khi bấm xóa, Backend dùng `AnyAsync()` kiểm tra xem phòng ban này còn nhân viên (`Employees`) hay còn tài sản (`Assets`) nào không.
  * Nếu còn $\rightarrow$ Trả về mã lỗi `400 Bad Request` chặn không cho xóa để tránh tạo ra các bản ghi mồ côi làm hỏng CSDL.
  * Chỉ khi phòng ban rỗng mới cho phép xóa.
* **Vị trí code**:
  * Backend: `SimpleERP.API/Controllers/DepartmentController.cs`
  * Frontend: `erp-client/src/app/pages/department/department-list.component.ts`

---

### PHÂN HỆ 5: QUẢN LÝ VẬT TƯ & THIẾT BỊ (ASSET)

#### 📌 Chức năng làm được:
* Quản lý danh mục tài sản/máy móc cấp phát cho các phòng ban (Laptop, Bàn ghế, Thiết bị CNTT...).
* Theo dõi 4 trạng thái: Đang sử dụng, Sẵn sàng cấp phát, Đang bảo trì, Hỏng.
* Thêm mới, Chỉnh sửa thông tin tài sản, Đơn giá, Số lượng, Ngày mua.
* Lọc tài sản theo từng Phòng ban và Tìm kiếm theo tên thiết bị.
* **Thanh phân trang máy chủ số 1-2-3**: Xem từng trang mượt mà.

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Phân trang tại Server bằng `IQueryable`**:
  * Nhận các tham số `page`, `pageSize`, `departmentId`, `search`.
  * Dùng `.Skip((page - 1) * pageSize).Take(pageSize)` để Database tự ngắt trang, chỉ kéo đúng 10 bản ghi về máy khách, tối ưu RAM.
  * Trả về kiểu chuẩn `PagedResultDTO<AssetDTO>` gồm `Items`, `TotalCount`, `PageNumber`, `TotalPages`.
* **Vị trí code**:
  * Backend: `SimpleERP.API/Controllers/AssetController.cs`
  * Frontend: `erp-client/src/app/pages/asset/asset-list.component.ts`, `asset.service.ts`

---

### PHÂN HỆ 6: QUẢN LÝ CHẤM CÔNG (ATTENDANCE)

#### 📌 Chức năng làm được:
* **Giao diện Quản trị viên**:
  * Xem bảng chấm công của toàn bộ nhân viên công ty.
  * **Thanh 4 bộ lọc kết hợp**: Lọc theo Phòng ban + Lọc trạng thái (Đúng giờ/Đi muộn) + Lọc theo Ngày + Tìm theo Tên.
* **Giao diện Nhân viên**:
  * Chấm công 1-chạm: Bấm Check-in khi đến công ty, Bấm Check-out khi về.
  * Xem bảng lịch sử chấm công của chính bản thân mình (không thấy của người khác).

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Quy tắc tự động mốc 8:15 AM**:
  * Khi bấm Check-in, Backend lấy giờ hệ thống. Nếu sau `08:15:00` $\rightarrow$ Tự động gắn trạng thái **Đi muộn (`Late`)**; nếu trước 8h15 $\rightarrow$ Gắn trạng thái **Đúng giờ (`OnTime`)**.
* **Triệt tiêu chấm công hộ**:
  * Backend không nhận `EmployeeId` từ giao diện gửi lên. Backend tự rút `EmployeeId` từ chuỗi JWT Token của người đang đăng nhập (`User.FindFirst(ClaimTypes.NameIdentifier)`), ngăn chặn việc đổi ID để chấm hộ người khác.
* **Chống chấm công đè**: Kiểm tra trong ngày nếu đã có bản ghi Check-in thì khóa nút, không cho bấm lần 2.
* **Lọc động `IQueryable`**: 4 bộ lọc được cộng dồn điều kiện ở Backend, chỉ sinh ra duy nhất 1 câu lệnh SQL truy vấn xuống Database.
* **Vị trí code**:
  * Backend: `SimpleERP.API/Controllers/AttendanceController.cs`
  * Frontend: `erp-client/src/app/pages/attendance/attendance-list.component.ts`

---

### PHÂN HỆ 7: QUY TRÌNH NGHỈ PHÉP (LEAVE REQUEST)

#### 📌 Chức năng làm được:
* **Nhân viên**:
  * Tạo đơn xin nghỉ phép (Chọn loại nghỉ: Phép năm, Nghỉ ốm, Việc riêng; Chọn ngày bắt đầu, ngày kết thúc và lý do).
  * Theo dõi trạng thái đơn: Chờ duyệt (`Pending`), Đã duyệt (`Approved`), Bị từ chối (`Rejected`).
  * Hủy đơn khi có việc đột xuất.
* **Quản trị viên**:
  * Xem danh sách các đơn nghỉ phép đang chờ duyệt.
  * Bấm nút **Duyệt (Approve)** hoặc **Từ chối (Reject)**.

#### 🛠️ Kỹ thuật xử lý ở đâu & Dùng cái gì?
* **Cơ chế Bảo vệ 2 lớp chống xóa bậy (Two-Layer Security)**:
  * **Lớp 1 (Giao diện Frontend)**: Dùng `@if (req.status === 'Pending')`. Chỉ khi đơn đang chờ duyệt mới hiện nút "Hủy đơn". Khi đơn đã được duyệt hoặc từ chối, nút Hủy hoàn toàn biến mất.
  * **Lớp 2 (Máy chủ Backend - Chốt chặn an toàn)**: Trong API xóa đơn, Backend kiểm tra lại trong Database:
    ```csharp
    if (request.Status != LeaveStatus.Pending)
        return BadRequest("Không thể hủy đơn nghỉ phép đã được phê duyệt!");
    ```
    Dù người dùng có cố tình dùng Postman gọi lệnh xóa thì Backend vẫn chặn đứng lại.
* **Vị trí code**:
  * Backend: `SimpleERP.API/Controllers/LeaveRequestController.cs`
  * Frontend: `erp-client/src/app/pages/leave-request/leave-request-list.component.ts`

---

### PHÂN HỆ 8: GIAO DIỆN RESPONSIVE & TRẢI NGHIỆM NGƯỜI DÙNG

#### 📌 Chức năng làm được:
* Tương thích hoàn hảo trên cả màn hình Desktop, Laptop, Tablet và Mobile.
* Trên điện thoại di động: Thanh Sidebar tự thu gọn, có nút Menu 3 gạch (Hamburger) bấm trượt ra mượt mà.
* Các bảng dữ liệu (Bảng Nhân viên, Bảng Vật tư) có thanh cuộn ngang tự động (`overflow-x-auto`), không bị vỡ giao diện trên màn hình nhỏ.

---

## 🎯 3. TỔNG KẾT TIẾN ĐỘ & TRẠNG THÁI HỆ THỐNG

* **Tiến độ**: Hoàn thành 100% các phân hệ cam kết.
* **Biên dịch**:
  * Backend: `dotnet build` $\rightarrow$ **0 Error(s)**.
  * Frontend: `ng build` $\rightarrow$ **0 Error(s)**.
* **Toàn bộ mã nguồn mới nhất**: Đã được đồng bộ và push lên nhánh `main` tại GitHub:
  👉 **https://github.com/NTThang-TT/SimpleERP**
