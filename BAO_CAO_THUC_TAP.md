# BÁO CÁO TỔNG KẾT THỰC TẬP TỐT NGHIỆP
## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP NỘI BỘ (SIMPLEERP)

---

* **Đơn vị thực tập**: [Tên Công ty / Doanh nghiệp Tiếp nhận Thực tập]
* **Cơ sở đào tạo**: [Trường Đại học / Cao đẳng] — Khoa Công nghệ Thông tin
* **Chuyên ngành**: Kỹ thuật Phần mềm / Hệ thống Thông tin
* **Sinh viên thực hiện**: **Nguyễn Tiến Thắng** (Mã sinh viên: [Mã SV của bạn])
* **Người hướng dẫn tại doanh nghiệp (Mentor)**: [Họ và tên Anh Mentor / Trưởng bộ phận]
* **Thời gian thực tập**: 14 Tuần (Từ tháng 06/2026 đến tháng 09/2026)
* **Kho lưu trữ mã nguồn (GitHub)**: [https://github.com/NTThang-TT/SimpleERP](https://github.com/NTThang-TT/SimpleERP)

---

## LỜI CẢM ƠN

Lời đầu tiên, em xin gửi lời cảm ơn chân thành và sâu sắc nhất tới Ban Lãnh đạo Công ty cùng toàn thể các anh chị đồng nghiệp tại đơn vị đã tạo điều kiện thuận lợi, tiếp nhận và hỗ trợ em trong suốt 14 tuần thực tập vừa qua.

Đặc biệt, em xin gửi lời cảm ơn sâu sắc nhất tới **Anh Mentor**, người đã trực tiếp hướng dẫn, định hướng bài toán, chỉ ra những điểm còn thiếu sót và tận tình chia sẻ những kinh nghiệm thực chiến quý báu về tư duy kiến trúc, quy chuẩn mã nguồn sạch cũng như nguyên tắc bảo mật phần mềm. Những lời nhận xét và góp ý sát sao của anh chính là động lực lớn giúp em hoàn thiện đồ án **SimpleERP** một cách nghiêm túc và bài bản nhất.

Em cũng xin gửi lời tri ân đến các Thầy Cô giáo trong Khoa Công nghệ Thông tin đã trang bị cho em nền tảng kiến thức lý thuyết vững chắc về cấu trúc dữ liệu, giải thuật, cơ sở dữ liệu và công nghệ phần mềm trong suốt những năm tháng trên giảng đường.

Dù đã rất nỗ lực hoàn thiện đề tài, song do thời gian và kinh nghiệm thực tế còn hạn chế, báo cáo khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những ý kiến đóng góp quý báu từ quý Thầy Cô và Hội đồng để đồ án được hoàn thiện hơn nữa.

*Hà Nội, Tháng 09 năm 2026*  
**Sinh viên thực hiện**  
*Nguyễn Tiến Thắng*

---

## DANH MỤC THUẬT NGỮ & TỪ VIẾT TẮT

| Thuật ngữ | Tên đầy đủ | Giải thích ngắn gọn |
| :--- | :--- | :--- |
| **ERP** | Enterprise Resource Planning | Hệ thống hoạch định và quản trị tài nguyên doanh nghiệp. |
| **RBAC** | Role-Based Access Control | Kiểm soát và phân quyền truy cập dựa trên vai trò người dùng. |
| **JWT** | JSON Web Token | Chuỗi mã hóa tiêu chuẩn mở dùng để xác thực người dùng an toàn. |
| **SPA** | Single Page Application | Ứng dụng web trang đơn, tải trang 1 lần và chuyển view mượt mà. |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng, cầu nối giữa Frontend và Backend. |
| **EF Core** | Entity Framework Core | Bộ công cụ ORM ánh xạ bảng CSDL thành các đối tượng trong C#. |
| **DTO** | Data Transfer Object | Đối tượng vận chuyển dữ liệu giữa tầng máy chủ và máy khách. |
| **RDBMS** | Relational Database Management System | Hệ thống quản trị cơ sở dữ liệu quan hệ (như SQL Server). |
| **CRUD** | Create, Read, Update, Delete | 4 thao tác cơ bản trên dữ liệu: Thêm, Xem, Sửa, Xóa. |

---

## CHƯƠNG 1: TỔNG QUAN ĐƠN VỊ THỰC TẬP & ĐỀ TÀI

### 1.1. Giới thiệu đơn vị thực tập
* Đơn vị tiếp nhận: [Tên Công ty / Bộ phận Kỹ thuật Công nghệ].
* Lĩnh vực hoạt động: Phát triển phần mềm, gia công ứng dụng web và giải pháp chuyển đổi số cho doanh nghiệp.
* Vị trí thực tập: **Thực tập sinh Lập trình Fullstack (Angular / .NET Developer Intern)**.

### 1.2. Kế hoạch và tiến độ thực tập chi tiết (14 tuần)

| Giai đoạn | Thời gian | Nhiệm vụ trọng tâm và Kết quả bàn giao |
| :--- | :---: | :--- |
| **Giai đoạn 1** | **Tuần 1 - 2** | - Tiếp nhận môi trường phát triển, văn hóa công ty, quy chuẩn Git flow.<br>- Khảo sát nghiệp vụ ERP nội bộ, phỏng vấn nhu cầu quản lý thực tế.<br>- Bàn giao: Bản đặc tả yêu cầu người dùng (SRS) sơ bộ. |
| **Giai đoạn 2** | **Tuần 3 - 4** | - Thiết kế kiến trúc tổng thể Client-Server phân tách.<br>- Thiết kế cơ sở dữ liệu quan hệ trên Microsoft SQL Server.<br>- Khởi tạo Solution Backend .NET 8 theo Clean Architecture và Project Frontend Angular 19. |
| **Giai đoạn 3** | **Tuần 5 - 6** | - Triển khai phân hệ Xác thực (Authentication): Mã hóa mật khẩu BCrypt, cấp phát JWT và cơ chế Refresh Token.<br>- Cấu hình `HttpInterceptor` ở Frontend tự động đính kèm Token và Silent Refresh. |
| **Giai đoạn 4** | **Tuần 7 - 8** | - Xây dựng phân hệ Quản lý Phòng ban (Department) với ràng buộc an toàn dữ liệu.<br>- Xây dựng phân hệ Quản lý Nhân sự (Employee) với thuật toán tự sinh mã định danh và cơ chế Xóa mềm (Soft Delete). |
| **Giai đoạn 5** | **Tuần 9 - 10** | - Xây dựng phân hệ Chấm công thông minh (Attendance): Quy tắc tự động mốc 8:15 AM, triệt tiêu việc chấm công hộ.<br>- Xây dựng phân hệ Xét duyệt Nghỉ phép (Leave Request) với cơ chế bảo vệ an toàn 2 lớp. |
| **Giai đoạn 6** | **Tuần 11 - 12** | - Phát triển phân hệ Quản lý Vật tư & Thiết bị (Asset Management).<br>- Thiết kế Dashboard KPI quản trị với kỹ thuật phản xạ tức thì **Angular Signals** (`computed`). |
| **Giai đoạn 7** | **Tuần 13** | - Tối ưu hóa truy vấn máy chủ bằng `IQueryable` (Deferred Execution).<br>- Bổ sung thanh phân trang máy chủ số 1-2-3 cho cả Vật tư và Nhân sự. |
| **Giai đoạn 8** | **Tuần 14** | - Kiểm thử toàn diện (Unit Test, Integration Test, Responsive trên Mobile).<br>- Đóng gói mã nguồn, viết tài liệu hướng dẫn và hoàn thiện báo cáo tốt nghiệp. |

### 1.3. Lý do chọn đề tài & Tính cấp thiết
Tại các doanh nghiệp vừa và nhỏ (quy mô 20 - 100 nhân sự), việc đầu tư hàng trăm triệu đồng cho các gói ERP quốc tế cồng kềnh như SAP hay Odoo là quá sức và lãng phí tính năng. Tuy nhiên, nếu tiếp tục quản lý nhân sự, chấm công và tài sản qua file Excel hoặc tin nhắn rời rạc thì doanh nghiệp sẽ đối mặt với:
1. **Thất thoát tài sản**: Không theo dõi được máy móc bàn giao cho phòng ban nào, tình trạng hoạt động ra sao.
2. **Sai lệch công xá**: Chấm công thủ công dễ bị gian lận, quên giờ hoặc chấm hộ.
3. **Mất an toàn dữ liệu**: Dữ liệu nhân viên dễ bị chỉnh sửa trái phép, không có phân quyền rõ ràng.

Đề tài **SimpleERP** ra đời nhằm giải quyết đúng và trúng các bài toán trên: cung cấp một giải pháp web **tinh gọn, chi phí thấp, triển khai nhanh và bảo mật tuyệt đối**.

---

## CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 2.1. Các tác nhân trong hệ thống (System Actors)
* **Quản trị viên (Admin / HR)**: Người có quyền hạn cao nhất trong hệ thống, chịu trách nhiệm quản lý cơ cấu tổ chức, quản lý nhân sự, cấp phát tài sản, giám sát bảng chấm công toàn viện và phê duyệt các đơn nghỉ phép.
* **Nhân viên (Employee)**: Người dùng thông thường trong doanh nghiệp, sử dụng hệ thống để tự phục vụ: xem bảng công của chính mình, thực hiện Check-in / Check-out hàng ngày và gửi đơn xin nghỉ phép.

### 2.2. Danh sách các Use Case chi tiết

```
                  ┌───────────────────────────────────────────────┐
                  │                   SimpleERP                   │
                  │                                               │
                  │   [Đăng nhập / Đổi mật khẩu]                  │
                  │   [Xem Dashboard KPI & Thống kê] <────────┐   │
   (Admin / HR) ──┼──>[Quản lý Hồ sơ Nhân sự (CRUD)]          │   │
        │         │   [Quản lý Cơ cấu Phòng ban]              │   │
        │         │   [Quản lý Tài sản & Vật tư]              │   │
        │         │   [Giám sát Chấm công toàn công ty]       │   │
        │         │   [Phê duyệt / Từ chối Đơn nghỉ phép]     │   │
        │         │                                           │   │
        │         │   [Chấm công 1-chạm (Check-in/Out)] <─────┼───┼── (Employee)
        └─────────┼──>[Xem lịch sử chấm công cá nhân] <───────┘   │
                  │   [Tạo & Theo dõi Đơn nghỉ phép] <────────────┘
                  └───────────────────────────────────────────────┘
```

1. **Use Case: Đăng nhập & Xác thực**
   * *Mô tả*: Người dùng nhập Username và Password để truy cập hệ thống.
   * *Điều kiện*: Tài khoản đang hoạt động (`IsDeleted = false`).
   * *Kết quả*: Nhận JWT Token và chuyển hướng vào trang chức năng phù hợp theo vai trò.
2. **Use Case: Chấm công trực tuyến (Self Check-in)**
   * *Mô tả*: Nhân viên bấm nút Check-in đầu ngày.
   * *Ràng buộc*: Chỉ được chấm cho chính mình, không được check-in 2 lần trong cùng ngày. Hệ thống tự động so sánh mốc `08:15:00` để phân loại trạng thái Đúng giờ hay Đi muộn.
3. **Use Case: Tạo và Xét duyệt Đơn nghỉ phép**
   * *Mô tả*: Nhân viên chọn ngày bắt đầu, ngày kết thúc và lý do nghỉ. Quản trị viên nhận thông tin và đưa ra quyết định Duyệt hoặc Từ chối.
   * *Ràng buộc an toàn*: Đơn đã được duyệt thì nhân viên không thể tự ý xóa hoặc hủy.
4. **Use Case: Quản lý Nhân sự & Tự sinh mã**
   * *Mô tả*: Admin thêm mới nhân sự. Hệ thống tự động phân tích họ tên để sinh mã định danh không trùng lặp, tự cấp tài khoản và mật khẩu mặc định đã mã hóa.
5. **Use Case: Quản lý Phòng ban & Bảo toàn dữ liệu**
   * *Mô tả*: Admin quản lý danh sách phòng ban. Hệ thống ngăn chặn việc xóa phòng ban nếu còn nhân viên hoặc tài sản đang trực thuộc.

### 2.3. Yêu cầu phi chức năng (Non-Functional Requirements)
* **Bảo mật (Security)**: Mật khẩu phải được băm an toàn (BCrypt). Mọi API nhạy cảm phải được bảo vệ bằng JWT Bearer Token. Triệt tiêu các nguy cơ gian lận quyền từ client.
* **Hiệu năng (Performance)**: Các bảng dữ liệu lớn phải được phân trang tại máy chủ (`Skip / Take`). Thời gian phản hồi API trung bình dưới 200ms.
* **Độ tương thích & Trải nghiệm (Usability & Responsive)**: Giao diện hiển thị tốt trên cả màn hình máy tính lớn và điện thoại di động thông qua thanh menu trượt và bảng tự cuộn.

---

## CHƯƠNG 3: THIẾT KẾ HỆ THỐNG & CƠ SỞ DỮ LIỆU

### 3.1. Kiến trúc phân tầng Backend (.NET 8 Clean Architecture)

Hệ thống Backend được phân chia thành 4 project tách biệt, tuân thủ nguyên tắc Dependency Inversion:

```
SimpleERP.API/                [TẦNG GIAO TIẾP]
  ├── Controllers/            ← Nhận HTTP Request, trả về DTOs
  ├── Middlewares/            ← Exception Handling, Logging
  └── Program.cs              ← Cấu hình DI, JWT, Database Context
        │ (gọi xuống)
SimpleERP.Infrastructure/     [TẦNG HẠ TẦNG DỮ LIỆU]
  ├── Data/AppDbContext.cs    ← Cấu hình Entity Framework Core
  ├── Repositories/           ← Triển khai các câu lệnh truy vấn SQL (IQueryable)
  └── DatabaseSeeder.cs       ← Khởi tạo dữ liệu mẫu ban đầu
        │ (triển khai)
SimpleERP.Core/               [TẦNG NGHIỆP VỤ CỐT LÕI]
  ├── Entities/               ← Định nghĩa các bảng CSDL (Domain Models)
  └── Interfaces/             ← Hợp đồng giao tiếp (IRepository interfaces)
        ▲
SimpleERP.Shared/             [TẦNG DỮ LIỆU CHUNG]
  ├── DTOs/                   ← Đối tượng truyền tải dữ liệu (EmployeeDTO, PagedResultDTO...)
  └── Helpers/                ← Hàm tiện ích mã hóa, định dạng
```

### 3.2. Thiết kế Cơ sở dữ liệu quan hệ (Database Schema)

Cơ sở dữ liệu bao gồm 6 bảng chính được chuẩn hóa mức 3NF, bảo đảm tính toàn vẹn thông qua các khóa ngoại:

#### 1. Bảng `Employees` (Hồ sơ nhân sự & Tài khoản)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `EmployeeId` | `VARCHAR(20)` | **PK** | Mã nhân viên tự sinh duy nhất (VD: `NV_15_NTT`). |
| `FullName` | `NVARCHAR(100)` | NOT NULL | Họ và tên đầy đủ của nhân viên. |
| `Email` | `VARCHAR(100)` | UNIQUE | Email công ty tự sinh (VD: `thang.nt@company.com`). |
| `PhoneNumber` | `VARCHAR(15)` | NULL | Số điện thoại liên hệ. |
| `DepartmentId` | `VARCHAR(20)` | **FK** | Khóa ngoại tham chiếu đến bảng `Departments`. |
| `PositionId` | `VARCHAR(20)` | **FK** | Khóa ngoại tham chiếu đến bảng `Positions`. |
| `HireDate` | `DATE` | NOT NULL | Ngày chính thức vào làm. |
| `Status` | `NVARCHAR(50)` | NOT NULL | Trạng thái: 'Đang hoạt động', 'Nghỉ phép', 'Đã nghỉ việc'. |
| `IsDeleted` | `BIT` | DEFAULT 0 | Cờ xóa mềm (0: Hoạt động, 1: Đã xóa). |
| `PasswordHash` | `VARCHAR(255)` | NOT NULL | Chuỗi mật khẩu băm bảo mật bằng BCrypt. |
| `RefreshToken` | `VARCHAR(255)` | NULL | Mã Token làm mới phiên đăng nhập. |
| `RefreshTokenExpiryTime`| `DATETIME2` | NULL | Thời điểm hết hạn của Refresh Token (7 ngày). |

#### 2. Bảng `Departments` (Cơ cấu phòng ban)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `DepartmentId` | `VARCHAR(20)` | **PK** | Mã định danh phòng ban (VD: `PB_KT`, `PB_IT`). |
| `DepartmentName`| `NVARCHAR(100)` | NOT NULL | Tên phòng ban (VD: Phòng Kỹ thuật, Phòng Kế toán). |
| `Location` | `NVARCHAR(100)` | NULL | Vị trí văn phòng làm việc. |

#### 3. Bảng `Positions` (Chức vụ chuyên môn)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `PositionId` | `VARCHAR(20)` | **PK** | Mã chức danh (VD: `DEV`, `TESTER`, `HR_LEAD`). |
| `PositionName` | `NVARCHAR(100)` | NOT NULL | Tên chức vụ chuyên môn. |

#### 4. Bảng `Assets` (Trang thiết bị & Vật tư)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `AssetId` | `VARCHAR(20)` | **PK** | Mã quản lý tài sản (VD: `VT01`, `VT02`). |
| `AssetName` | `NVARCHAR(150)` | NOT NULL | Tên tài sản (VD: Laptop Dell XPS 15, Bàn làm việc). |
| `Category` | `NVARCHAR(50)` | NOT NULL | Danh mục: Thiết bị CNTT, Thiết bị văn phòng... |
| `Quantity` | `INT` | NOT NULL | Số lượng thiết bị. |
| `Unit` | `NVARCHAR(20)` | NOT NULL | Đơn vị tính (cái, bộ, chiếc). |
| `UnitPrice` | `DECIMAL(18,2)`| NOT NULL | Đơn giá mua sắm. |
| `DepartmentId` | `VARCHAR(20)` | **FK** | Phòng ban hiện đang được cấp phát sử dụng. |
| `Status` | `NVARCHAR(50)` | NOT NULL | Trạng thái: Đang sử dụng, Sẵn sàng, Bảo trì, Hỏng. |
| `PurchaseDate` | `DATE` | NOT NULL | Ngày mua sắm nhập kho. |

#### 5. Bảng `Attendances` (Bản ghi chấm công hàng ngày)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `AttendanceId` | `INT` | **PK (Identity)** | Mã định danh bản ghi chấm công. |
| `EmployeeId` | `VARCHAR(20)` | **FK** | Khóa ngoại tham chiếu đến nhân viên chấm công. |
| `Date` | `DATE` | NOT NULL | Ngày làm việc. |
| `CheckIn` | `TIME` | NOT NULL | Thời điểm bấm Check-in đầu ngày. |
| `CheckOut` | `TIME` | NULL | Thời điểm bấm Check-out cuối ngày. |
| `Status` | `NVARCHAR(50)` | NOT NULL | Trạng thái tự tính: 'OnTime' (Đúng giờ) / 'Late' (Đi muộn). |
| `Note` | `NVARCHAR(255)` | NULL | Ghi chú cá nhân của nhân viên. |

#### 6. Bảng `LeaveRequests` (Đơn xin nghỉ phép)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `LeaveRequestId`| `INT` | **PK (Identity)** | Mã số đơn nghỉ phép. |
| `EmployeeId` | `VARCHAR(20)` | **FK** | Nhân viên làm đơn. |
| `LeaveType` | `NVARCHAR(50)` | NOT NULL | Loại nghỉ: Nghỉ phép năm, Nghỉ ốm, Việc riêng. |
| `StartDate` | `DATE` | NOT NULL | Ngày bắt đầu nghỉ. |
| `EndDate` | `DATE` | NOT NULL | Ngày kết thúc nghỉ. |
| `Reason` | `NVARCHAR(500)` | NOT NULL | Lý do xin nghỉ. |
| `Status` | `NVARCHAR(50)` | NOT NULL | Trạng thái: 'Pending' (Chờ duyệt), 'Approved', 'Rejected'. |
| `ApprovedBy` | `VARCHAR(20)` | NULL | Mã quản trị viên đã thực hiện phê duyệt. |
| `CreatedAt` | `DATETIME2` | NOT NULL | Thời điểm gửi đơn lên hệ thống. |

### 3.3. Danh mục API RESTful chính thức

| Phân hệ | Phương thức | Endpoint API | Quyền hạn | Mô tả chức năng |
| :--- | :---: | :--- | :---: | :--- |
| **Auth** | `POST` | `/api/auth/login` | Public | Đăng nhập hệ thống, cấp Access Token và Refresh Token. |
| **Auth** | `POST` | `/api/auth/refresh-token` | Public | Cấp lại Access Token mới khi token cũ hết hạn. |
| **Dashboard** | `GET` | `/api/employee/statistics` | Admin/Employee | Lấy số liệu KPI tổng hợp phòng ban và nhân sự. |
| **Employee** | `GET` | `/api/employee` | Admin | Lấy danh sách nhân viên có phân trang và tìm kiếm. |
| **Employee** | `POST` | `/api/employee` | Admin | Thêm mới nhân sự (kích hoạt thuật toán tự sinh mã). |
| **Employee** | `DELETE`| `/api/employee/{id}` | Admin | Xóa mềm nhân viên (`IsDeleted = true`). |
| **Department**| `GET` | `/api/department` | Admin/Employee | Lấy danh sách phòng ban. |
| **Department**| `DELETE`| `/api/department/{id}` | Admin | Xóa phòng ban (có kiểm tra ràng buộc nhân sự & tài sản). |
| **Asset** | `GET` | `/api/asset` | Admin/Employee | Lấy danh sách vật tư phân trang máy chủ số 1-2-3. |
| **Asset** | `POST` | `/api/asset` | Admin | Thêm mới vật tư cấp phát cho phòng ban. |
| **Attendance**| `POST` | `/api/attendance/check-in` | Employee | Chấm công đầu ngày (áp dụng mốc 8:15 AM). |
| **Attendance**| `GET` | `/api/attendance` | Admin | Xem bảng công toàn công ty với 4 bộ lọc kết hợp. |
| **Attendance**| `GET` | `/api/attendance/my-history`| Employee | Xem lịch sử chấm công của chính người đang đăng nhập. |
| **Leave** | `POST` | `/api/leave-request` | Employee | Gửi đơn xin nghỉ phép mới (trạng thái Pending). |
| **Leave** | `PUT` | `/api/leave-request/{id}/approve` | Admin | Phê duyệt đơn xin nghỉ phép. |
| **Leave** | `DELETE`| `/api/leave-request/{id}` | Employee | Hủy đơn xin nghỉ (chỉ được hủy khi còn Pending). |

---

## CHƯƠNG 4: TRIỂN KHAI KỸ THUẬT & CÁC GIẢI PHÁP CỐT LÕI

### 4.1. Giải pháp Bảo mật Xác thực Stateless với JWT & BCrypt

#### Bản chất kỹ thuật:
* Khi lưu mật khẩu vào cơ sở dữ liệu, nếu chỉ băm bằng MD5 hay SHA256 thông thường thì kẻ tấn công có thể dùng bảng tra cứu sẵn (Rainbow Table) để dò ngược ra mật khẩu.
* Dự án sử dụng thư viện **BCrypt.Net** với hệ số chi phí (Work Factor) là 11. Thuật toán này tự động tạo ra một chuỗi Salt ngẫu nhiên 128-bit và trộn vào mật khẩu trước khi băm. Cùng một mật khẩu `123456`, nhưng hai tài khoản khác nhau sẽ có hai chuỗi băm hoàn toàn khác nhau.
* Khi đăng nhập thành công, máy chủ sinh ra chuỗi **JSON Web Token** được ký bằng mật mã đối xứng `HMAC-SHA256`. Chuỗi Token này gồm 3 phần: Header, Payload (chứa các Claims: `NameIdentifier`, `Role`, `Name`), và Signature.

#### Vòng đời Token an toàn (Silent Refresh Token):
```
Client (Angular)                                          Server (.NET 8)
   │                                                             │
   ├─── (1) Gửi Request kèm Access Token (Đã hết hạn 2h) ───────>│
   │<── (2) Trả về lỗi 401 Unauthorized ─────────────────────────┤
   │                                                             │
   │    [authInterceptor tự động chặn lỗi 401]                   │
   ├─── (3) Tự gọi ngầm POST /api/auth/refresh-token ───────────>│
   │<── (4) Trả về Access Token mới ─────────────────────────────┤
   │                                                             │
   │    [authInterceptor gán Token mới]                          │
   ├─── (5) Tự động gọi lại Request ban đầu (1) ────────────────>│
   │<── (6) Trả về dữ liệu thành công 200 OK ────────────────────┤
   ▼                                                             ▼
(Người dùng trên trình duyệt không hề hay biết, không bị văng ra trang Login)
```

### 4.2. Thuật toán Tự sinh Mã nhân viên & Chống va chạm khóa (Collision Prevention)

#### Vấn đề thực tế:
Nếu để người dùng tự nhập mã nhân sự, dữ liệu sẽ không chuẩn hóa (người nhập chữ thường, người nhập dấu cách) và rất dễ xảy ra lỗi trùng lặp khóa chính.

#### Giải pháp triển khai:
Mã nguồn tại file `EmployeeRepository.cs` thực hiện các bước sau:
1. Phân tích chuỗi Họ và tên tiếng Việt: Tách các từ, loại bỏ khoảng trắng thừa, lấy chữ cái đầu viết hoa (Ví dụ: "Nguyễn Tiến Thắng" $\rightarrow$ `NTT`).
2. Đếm số lượng nhân viên hiện tại trong bảng `Employees`.
3. Ghép chuỗi theo quy tắc: `code = $"NV_{count + 1}_{initials}"`.
4. **Vòng lặp chống va chạm tuyệt đối**: Để phòng ngừa trường hợp có người trùng tên viết tắt hoặc có nhân viên đã bị xóa trước đó, hệ thống chạy vòng lặp kiểm tra:
   ```csharp
   while (await _context.Employees.AnyAsync(e => e.EmployeeCode == code))
   {
       counter++;
       code = $"NV_{counter}_{initials}";
   }
   ```
5. Kết hợp đánh chỉ mục duy nhất (`UNIQUE INDEX`) trên cột `EmployeeCode` trong SQL Server để đảm bảo tính toàn vẹn ở mức vật lý.

### 4.3. Cơ chế Xóa mềm (Soft Delete) & Bảo toàn dữ liệu lịch sử

#### Vấn đề thực tế:
Nhân viên trong doanh nghiệp liên kết với dữ liệu chấm công, đơn từ và tài sản. Nếu thực hiện `DELETE FROM Employees WHERE Id = ...` (Hard Delete), hai hậu quả nghiêm trọng sẽ xảy ra:
1. Vi phạm ràng buộc khóa ngoại (Foreign Key Constraint Violation) khiến hệ thống báo lỗi 500.
2. Mất hoàn toàn lịch sử chấm công và bàn giao tài sản của nhân viên đó trong các tháng trước.

#### Giải pháp triển khai:
* Bổ sung cột cờ `IsDeleted BIT DEFAULT 0` trong bảng `Employees`.
* Khi gọi API Xóa:
  ```csharp
  employee.IsDeleted = true;
  await _context.SaveChangesAsync();
  ```
* Mọi câu truy vấn danh sách nhân viên, tính lương, chấm công đều tự động lồng điều kiện: `Where(e => !e.IsDeleted)`.
* Nhân viên không còn nhìn thấy trên giao diện, nhưng toàn bộ lịch sử trong quá khứ vẫn được lưu vết trọn vẹn.

### 4.4. Nghiệp vụ Chấm công & Triệt tiêu hoàn toàn nguy cơ Chấm công hộ

#### Vấn đề thực tế:
Nếu API Check-in nhận tham số `{ "employeeId": "NV01" }` từ Client gửi lên, một nhân viên biết sử dụng Postman hoặc DevTools F12 có thể sửa tham số thành `{ "employeeId": "NV02" }` để điểm danh hộ đồng nghiệp.

#### Giải pháp triển khai:
* Mã nguồn tại `AttendanceController.cs` **hoàn toàn không nhận `EmployeeId` từ Body của Request**.
* Máy chủ tự động giải mã chuỗi JWT Token của người đang gửi request để trích xuất định danh:
  ```csharp
  var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
  ```
* Do Token được ký bằng khóa bí mật HMAC-SHA256, người dùng không thể tự giả mạo Token của người khác. Kỹ thuật này triệt tiêu 100% khả năng chấm công hộ.
* **Tự động phát hiện đi muộn**:
  ```csharp
  var checkInTime = DateTime.Now.TimeOfDay;
  var cutoff = new TimeSpan(8, 15, 0); // Mốc 08:15:00 sáng
  string status = checkInTime > cutoff ? "Late" : "OnTime";
  ```

### 4.5. Cơ chế Bảo vệ An toàn Dữ liệu 2 Lớp ở Quy trình Nghỉ phép

#### Vấn đề thực tế:
Sau khi đơn xin nghỉ phép đã được Giám đốc bấm Duyệt (`Approved`), nhân viên không được phép tự ý hủy đơn. Nếu chỉ ẩn nút "Hủy đơn" trên giao diện web, người dùng am hiểu kỹ thuật vẫn có thể mở Postman gửi lệnh `DELETE /api/leave-request/{id}`.

#### Giải pháp bảo vệ 2 lớp (Two-Layer Security):
1. **Lớp 1 (Phía Frontend Client)**: Sử dụng cú pháp điều khiển luồng của Angular 19:
   ```html
   @if (request.status === 'Pending') {
     <button (click)="cancelRequest(request.id)">Hủy đơn</button>
   }
   ```
   Nếu đơn đã ở trạng thái `Approved` hoặc `Rejected`, nút Hủy sẽ biến mất khỏi giao diện.
2. **Lớp 2 (Phía Backend Server - Chốt chặn an toàn cuối cùng)**: Trong API xóa đơn, máy chủ truy vấn lại trực tiếp từ CSDL:
   ```csharp
   var request = await _context.LeaveRequests.FindAsync(id);
   if (request.Status != LeaveStatus.Pending)
   {
       return BadRequest(new { message = "Không thể hủy đơn nghỉ phép đã được phê duyệt hoặc từ chối!" });
   }
   ```
   Dù người dùng có cố tình can thiệp bằng công cụ bên ngoài, máy chủ vẫn chặn đứng và từ chối xử lý.

### 4.6. Tối ưu hóa truy vấn máy chủ với `IQueryable` & Phân trang số 1-2-3

#### Khái niệm & Cơ chế Deferred Execution:
* Nếu dùng `IEnumerable`, chương trình sẽ kéo toàn bộ hàng chục nghìn bản ghi từ Database về bộ nhớ RAM của Web Server rồi mới lọc, gây nguy cơ tràn bộ nhớ.
* Dự án áp dụng `IQueryable` của Entity Framework Core. Các bộ lọc tìm kiếm, phòng ban, trạng thái được cộng dồn điều kiện ở mã nguồn C#. Entity Framework chỉ dịch và gửi **đúng 1 câu lệnh SQL duy nhất** xuống CSDL khi gọi `.ToListAsync()`:

```csharp
var query = _context.Assets.Include(a => a.Department).AsQueryable();

if (!string.IsNullOrEmpty(departmentId) && departmentId != "all")
    query = query.Where(a => a.DepartmentId == departmentId);

if (!string.IsNullOrEmpty(search))
    query = query.Where(a => a.AssetName.Contains(search) || a.AssetId.Contains(search));

var totalCount = await query.CountAsync(); // Sinh ra SQL: SELECT COUNT(*) FROM Assets WHERE...

var items = await query
    .OrderByDescending(a => a.AssetId)
    .Skip((page - 1) * pageSize)              // Sinh ra SQL: OFFSET ... ROWS
    .Take(pageSize)                           // Sinh ra SQL: FETCH NEXT 10 ROWS ONLY
    .ToListAsync();
```

#### Phân trang số 1-2-3 ở Frontend:
Tại các màn hình Quản lý Nhân sự (`employee-list.component.ts`) và Quản lý Vật tư (`asset-list.component.ts`), hệ thống sử dụng `computed()` Signal:
```typescript
pagesArray = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
```
Giao diện sinh ra các nút bấm trực quan `[1] [2] [3]...` giúp người quản trị dễ dàng nhảy cóc tới trang mong muốn hoặc bấm "Trước" / "Sau".

---

## CHƯƠNG 5: KIỂM THỬ HỆ THỐNG & ĐÁNH GIÁ KẾT QUẢ

### 5.1. Kế hoạch và Phương pháp kiểm thử
Dự án được kiểm thử toàn diện thông qua 3 phương pháp:
1. **Kiểm thử chức năng (Functional Testing)**: Kiểm tra tính đúng đắn của từng nút bấm, form nhập liệu và luồng nghiệp vụ.
2. **Kiểm thử biên & Bắt lỗi (Validation Testing)**: Kiểm tra các trường hợp nhập sai định dạng, bỏ trống trường bắt buộc, chọn ngày trong quá khứ.
3. **Kiểm thử bảo mật & Phân quyền (Security & RBAC Testing)**: Thử nghiệm giả mạo quyền hạn, vượt tường lửa URL và can thiệp API bằng Postman.

### 5.2. Bảng kết quả kiểm thử chi tiết (Test Cases Matrix)

| STT | Tên ca kiểm thử | Điều kiện kiểm thử | Các bước thực hiện | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Đăng nhập sai mật khẩu | Màn hình Login | Nhập `lam.nq` / `sai_mat_khau`, bấm Đăng nhập | Hiển thị thông báo lỗi màu đỏ, không cấp Token | Hiện lỗi: "Tên đăng nhập hoặc mật khẩu không chính xác" | **PASS** |
| **TC02** | Đăng nhập thành công Admin | Màn hình Login | Nhập `lam.nq` / `lam.nq`, bấm Đăng nhập | Cấp JWT Token, lưu LocalStorage, chuyển vào Dashboard | Đăng nhập thành công, menu Admin hiện đầy đủ | **PASS** |
| **TC03** | Đăng nhập thành công Employee | Màn hình Login | Nhập `thang.nt` / `thang.nt`, bấm Đăng nhập | Cấp JWT Token, ẩn các menu quản trị | Đăng nhập thành công, chỉ thấy chức năng cá nhân | **PASS** |
| **TC04** | Chặn truy cập vượt quyền | Tài khoản Employee | Gõ trực tiếp URL `http://localhost:4200/employees` | `roleGuard` chặn lại, điều hướng về Dashboard | Bị chặn tức thì, giữ an toàn hệ thống | **PASS** |
| **TC05** | Tự sinh mã nhân viên | Màn hình Thêm NV | Nhập tên "Lê Hoàng Nam", chọn phòng ban | Ô mã bị readonly, tự tạo mã `NV_XX_LHN`, tạo username `nam.lh` | Mã sinh ra chính xác, không trùng lặp | **PASS** |
| **TC06** | Xóa mềm nhân viên | Danh sách NV | Bấm Xóa nhân viên vừa tạo | Bản ghi ẩn khỏi bảng, CSDL cập nhật `IsDeleted = 1` | Nhân viên biến mất khỏi danh sách, DB giữ nguyên dòng | **PASS** |
| **TC07** | Chặn xóa phòng ban có người | Danh sách Phòng ban | Bấm Xóa "Phòng Kỹ thuật" | Backend quăng lỗi 400 do còn nhân viên | Hiện cảnh báo: "Không thể xóa phòng ban đang có nhân viên" | **PASS** |
| **TC08** | Xóa phòng ban rỗng | Danh sách Phòng ban | Tạo phòng ban mới (không người), bấm Xóa | Xóa thành công, phòng ban biến mất | Xóa thành công 100% | **PASS** |
| **TC09** | Chấm công đúng giờ | Đăng nhập Employee | Bấm Check-in lúc 08:05 sáng | Gắn cờ trạng thái "OnTime", badge màu xanh lá | Ghi nhận giờ check-in, badge xanh "Đúng giờ" | **PASS** |
| **TC10** | Chấm công đi muộn | Đăng nhập Employee | Bấm Check-in lúc 08:20 sáng | Gắn cờ trạng thái "Late", badge màu vàng cam | Tự động phân loại "Đi muộn" chuẩn xác | **PASS** |
| **TC11** | Chống chấm công đè | Đã check-in hôm nay | Bấm nút Check-in lần thứ hai | Nút Check-in bị vô hiệu hóa (disabled) | Nút bị khóa, chỉ cho phép bấm Check-out | **PASS** |
| **TC12** | Tạo đơn nghỉ phép | Màn hình Nghỉ phép | Chọn ngày 25/09 đến 26/09, lý do "Ốm" | Đơn tạo thành công, trạng thái ban đầu là `Pending` | Đơn xuất hiện trên bảng với badge "Chờ duyệt" | **PASS** |
| **TC13** | Phê duyệt đơn nghỉ phép | Đăng nhập Admin | Mở danh sách đơn, bấm nút "Duyệt" | Trạng thái chuyển sang `Approved`, lưu người duyệt | Cập nhật tức thì `Approved`, hiển thị tên Admin duyệt | **PASS** |
| **TC14** | Khóa nút hủy khi đã duyệt | Đăng nhập Employee | Xem lại đơn đã được duyệt ở TC13 | Nút "Hủy đơn" biến mất hoàn toàn | Không còn nút Hủy trên giao diện | **PASS** |
| **TC15** | Chặn xóa đơn đã duyệt qua API | Dùng Postman | Gửi `DELETE /api/leave-request/{id}` đơn đã duyệt | Server trả về `400 Bad Request`, từ chối xóa | Backend chặn đứng, phản hồi lỗi 400 | **PASS** |
| **TC16** | Phân trang số Vật tư & Nhân sự | Danh sách Vật tư | Bấm nút chuyển sang trang `[2]` | Bảng tải trang 2, URL giữ nguyên, DB chạy `Skip/Take` | Tải trang mượt mà dưới 0.1 giây, nút `[2]` active | **PASS** |

### 5.3. Đánh giá chất lượng sản phẩm
* **Tỷ lệ vượt qua kiểm thử**: 16/16 Test Cases đạt chuẩn (100%).
* **Độ ổn định mã nguồn**: Không phát sinh lỗi rò rỉ bộ nhớ (Memory Leak) nhờ áp dụng Angular Signals thay vì lưu trữ các Subscription không giải phóng.
* **Thời gian đáp ứng**: Toàn bộ các câu truy vấn phân trang và tìm kiếm đều thực thi dưới 100ms trên cơ sở dữ liệu mẫu.

---

## CHƯƠNG 6: KẾT LUẬN & HƯỚNG PHÁT TRIỂN

### 6.1. Những kết quả nổi bật đã đạt được
1. **Hoàn thiện 100% phạm vi cam kết**: Xây dựng thành công hệ thống SimpleERP với đầy đủ 5 phân hệ vận hành và 1 bảng điều khiển trung tâm.
2. **Làm chủ công nghệ tiên tiến**: Vận dụng thành công các công nghệ mới nhất hiện nay: **Angular 19** với cơ chế Signals phản xạ mịn, kết hợp **ASP.NET Core 8 Web API** chuẩn Clean Architecture.
3. **Bảo mật chuẩn mực doanh nghiệp**: Áp dụng thành công cơ chế xác thực Stateless JWT, Silent Refresh Token và bảo mật dữ liệu 2 lớp (Client & Server).
4. **Tối ưu hóa hiệu năng**: Làm chủ kỹ thuật truy vấn trì hoãn `IQueryable` và phân trang máy chủ số 1-2-3 trực quan.

### 6.2. Những điểm còn hạn chế
* Chưa tích hợp tính năng gửi Email tự động thông báo khi đơn nghỉ phép được duyệt.
* Chưa có tính năng trích xuất báo cáo chấm công tổng hợp hàng tháng ra file Excel/PDF.

### 6.3. Bài học kinh nghiệm quý báu thu nhận được
* **Tư duy thiết kế hệ thống**: Học được cách phân tích bài toán nghiệp vụ từ thực tế, thiết kế cấu trúc CSDL chuẩn hóa và tổ chức dự án tách bạch theo Repository Pattern.
* **Tác phong làm việc chuyên nghiệp**: Nâng cao kỹ năng quản lý mã nguồn bằng Git, viết mã nguồn sạch (Clean Code), viết tài liệu báo cáo rõ ràng và kỹ năng thuyết trình bảo vệ trước hội đồng.

### 6.4. Kế hoạch phát triển mở rộng trong tương lai
1. **Thông báo thời gian thực (Real-time Notification)**: Tích hợp thư viện **Microsoft SignalR** để truyền dữ liệu 2 chiều. Khi Admin bấm duyệt đơn, chuông thông báo trên màn hình nhân viên sẽ rung ngay lập tức.
2. **Xuất báo cáo Excel / PDF**: Tích hợp thư viện `EPPlus` ở Backend để người quản trị có thể tải về file Excel bảng công chi tiết cuối tháng phục vụ tính lương.
3. **Chấm công qua định vị GPS / WiFi công ty**: Mở rộng API kiểm tra dải IP mạng văn phòng hoặc tọa độ địa lý nhằm phục vụ cho nhân viên chấm công trên điện thoại di động khi bước chân vào văn phòng.

---

## TÀI LIỆU THAM KHẢO

1. **Microsoft Corporation** (2024), *ASP.NET Core Documentation & Entity Framework Core Architecture Guide*, Microsoft Learn.
2. **Google Angular Team** (2024), *Angular 19 Documentation: Standalone Components and Reactivity with Angular Signals*, Angular.dev.
3. **RFC 7519 Standards** (2015), *JSON Web Token (JWT) Architecture and Security Guidelines*, Internet Engineering Task Force (IETF).
4. **Robert C. Martin** (2017), *Clean Architecture: A Craftsman's Guide to Software Structure and Design*, Prentice Hall.
