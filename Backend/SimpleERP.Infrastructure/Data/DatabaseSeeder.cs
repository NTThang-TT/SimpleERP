using Microsoft.EntityFrameworkCore;
using SimpleERP.Core.Entities;

namespace SimpleERP.Infrastructure.Data;

/// <summary>
/// DatabaseSeeder — Tự động tạo dữ liệu mẫu đầy đủ cho hệ thống
/// Bao gồm: 5 Phòng ban, 10 Chức vụ, 50 Nhân viên, 35 Vật tư
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Chỉ seed khi DB chưa có dữ liệu
        if (await context.Departments.AnyAsync()) return;

        // ===== 1. PHÒNG BAN (5) =====
        var departments = new List<Department>
        {
            new() { DepartmentId = "DEP_IT",  DepartmentName = "Công Nghệ Thông Tin",  Location = "Tầng 3 - Tòa nhà A" },
            new() { DepartmentId = "DEP_HR",  DepartmentName = "Hành Chính Nhân Sự",   Location = "Tầng 2 - Tòa nhà A" },
            new() { DepartmentId = "DEP_MKT", DepartmentName = "Marketing & Sales",    Location = "Tầng 4 - Tòa nhà B" },
            new() { DepartmentId = "DEP_ACC", DepartmentName = "Kế Toán Tài Chính",    Location = "Tầng 2 - Tòa nhà A" },
            new() { DepartmentId = "DEP_BOD", DepartmentName = "Ban Giám Đốc",         Location = "Tầng 5 - Tòa nhà A" }
        };
        context.Departments.AddRange(departments);

        // ===== 2. CHỨC VỤ (10) =====
        var positions = new List<Position>
        {
            new() { PositionId = "POS_CEO",    PositionName = "Giám đốc",           BaseSalary = 80000000 },
            new() { PositionId = "POS_MGR",    PositionName = "Trưởng Phòng",       BaseSalary = 40000000 },
            new() { PositionId = "POS_DEPUTY", PositionName = "Phó Phòng",          BaseSalary = 32000000 },
            new() { PositionId = "POS_NET",    PositionName = ".NET Developer",     BaseSalary = 25000000 },
            new() { PositionId = "POS_FE",     PositionName = "Frontend Developer", BaseSalary = 22000000 },
            new() { PositionId = "POS_AI",     PositionName = "AI Engineer",        BaseSalary = 35000000 },
            new() { PositionId = "POS_DEVOPS", PositionName = "DevOps Engineer",    BaseSalary = 30000000 },
            new() { PositionId = "POS_STAFF",  PositionName = "Chuyên viên",        BaseSalary = 15000000 },
            new() { PositionId = "POS_INTERN", PositionName = "Thực tập sinh",      BaseSalary = 5000000 },
            new() { PositionId = "POS_ACC",    PositionName = "Kế toán viên",       BaseSalary = 18000000 }
        };
        context.Positions.AddRange(positions);

        // ===== 3. NHÂN VIÊN (50) =====
        var employees = new List<Employee>
        {
            // --- Ban Giám Đốc (3) ---
            new() { EmployeeId="NV_01_L", FullName="Ngô Quý Lâm",       Email="lam.nq@erp.vn",      PhoneNumber="0917777777", DepartmentId="DEP_BOD", PositionId="POS_CEO",    HireDate=new DateTime(2020,1,1),  Status="Đang hoạt động", Username="lam.nq",    Role="Admin" },
            new() { EmployeeId="NV_02_H", FullName="Trần Thị Hương",     Email="huong.tt@erp.vn",    PhoneNumber="0917777778", DepartmentId="DEP_BOD", PositionId="POS_DEPUTY", HireDate=new DateTime(2020,3,15), Status="Đang hoạt động", Username="huong.tt",  Role="Employee" },
            new() { EmployeeId="NV_03_T", FullName="Lê Minh Tuấn",       Email="tuan.lm@erp.vn",     PhoneNumber="0917777779", DepartmentId="DEP_BOD", PositionId="POS_STAFF",  HireDate=new DateTime(2021,6,1),  Status="Đang hoạt động", Username="tuan.lm",   Role="Employee" },
            // --- Phòng IT (12) ---
            new() { EmployeeId="NV_04_T", FullName="Nguyễn Tất Thắng",   Email="thang.nt@erp.vn",    PhoneNumber="0901111111", DepartmentId="DEP_IT",  PositionId="POS_NET",    HireDate=new DateTime(2022,1,15), Status="Đang hoạt động", Username="thang.nt",  Role="Employee" },
            new() { EmployeeId="NV_05_H", FullName="Bảo Hân Nguyễn",     Email="han.nb@erp.vn",      PhoneNumber="0902222222", DepartmentId="DEP_IT",  PositionId="POS_AI",     HireDate=new DateTime(2023,3,1),  Status="Đang hoạt động", Username="han.nb",    Role="Employee" },
            new() { EmployeeId="NV_06_C", FullName="Trần Văn Cường",     Email="cuong.tv@erp.vn",    PhoneNumber="0903333333", DepartmentId="DEP_IT",  PositionId="POS_INTERN", HireDate=new DateTime(2024,1,10), Status="Đang hoạt động", Username="cuong.tv",  Role="Employee" },
            new() { EmployeeId="NV_07_D", FullName="Lê Thị Diễm",       Email="diem.lt@erp.vn",     PhoneNumber="0904444444", DepartmentId="DEP_IT",  PositionId="POS_FE",     HireDate=new DateTime(2022,6,20), Status="Đang hoạt động", Username="diem.lt",   Role="Employee" },
            new() { EmployeeId="NV_08_E", FullName="Phạm Minh Đức",     Email="duc.pm@erp.vn",      PhoneNumber="0905555555", DepartmentId="DEP_IT",  PositionId="POS_NET",    HireDate=new DateTime(2021,11,11),Status="Nghỉ phép",     Username="duc.pm",    Role="Employee" },
            new() { EmployeeId="NV_09_F", FullName="Hoàng Văn Phúc",    Email="phuc.hv@erp.vn",     PhoneNumber="0906666666", DepartmentId="DEP_IT",  PositionId="POS_DEVOPS", HireDate=new DateTime(2023,8,5),  Status="Đang hoạt động", Username="phuc.hv",   Role="Employee" },
            new() { EmployeeId="NV_10_S", FullName="Trịnh Thái Sơn",    Email="son.tt@erp.vn",      PhoneNumber="0957777777", DepartmentId="DEP_IT",  PositionId="POS_FE",     HireDate=new DateTime(2023,5,5),  Status="Đang hoạt động", Username="son.tt",    Role="Employee" },
            new() { EmployeeId="NV_11_G", FullName="Lâm Trường Giang",  Email="giang.lt@erp.vn",    PhoneNumber="0960000000", DepartmentId="DEP_IT",  PositionId="POS_AI",     HireDate=new DateTime(2022,8,15), Status="Đã nghỉ việc",   Username="giang.lt",  Role="Employee" },
            new() { EmployeeId="NV_12_K", FullName="Đặng Quốc Khánh",   Email="khanh.dq@erp.vn",    PhoneNumber="0961111111", DepartmentId="DEP_IT",  PositionId="POS_NET",    HireDate=new DateTime(2023,9,1),  Status="Đang hoạt động", Username="khanh.dq",  Role="Employee" },
            new() { EmployeeId="NV_13_P", FullName="Võ Thị Phương",     Email="phuong.vt@erp.vn",   PhoneNumber="0962222222", DepartmentId="DEP_IT",  PositionId="POS_FE",     HireDate=new DateTime(2024,2,1),  Status="Đang hoạt động", Username="phuong.vt", Role="Employee" },
            new() { EmployeeId="NV_14_N", FullName="Bùi Thanh Nam",     Email="nam.bt@erp.vn",      PhoneNumber="0963333333", DepartmentId="DEP_IT",  PositionId="POS_DEVOPS", HireDate=new DateTime(2023,7,15), Status="Đang hoạt động", Username="nam.bt",    Role="Employee" },
            new() { EmployeeId="NV_15_Q", FullName="Nguyễn Hoàng Quân", Email="quan.nh@erp.vn",     PhoneNumber="0964444444", DepartmentId="DEP_IT",  PositionId="POS_INTERN", HireDate=new DateTime(2024,6,1),  Status="Đang hoạt động", Username="quan.nh",   Role="Employee" },
            // --- Phòng Nhân Sự (8) ---
            new() { EmployeeId="NV_16_M", FullName="Đinh Tuấn Mạnh",    Email="manh.dt@erp.vn",     PhoneNumber="0918888888", DepartmentId="DEP_HR",  PositionId="POS_MGR",    HireDate=new DateTime(2020,5,15), Status="Đang hoạt động", Username="manh.dt",   Role="HR" },
            new() { EmployeeId="NV_17_A", FullName="Nguyễn Mai Anh",    Email="anh.nm@erp.vn",      PhoneNumber="0919999999", DepartmentId="DEP_HR",  PositionId="POS_STAFF",  HireDate=new DateTime(2023,2,14), Status="Đang hoạt động", Username="anh.nm",    Role="Employee" },
            new() { EmployeeId="NV_18_B", FullName="Trần Thanh Bình",   Email="binh.tt@erp.vn",     PhoneNumber="0920000000", DepartmentId="DEP_HR",  PositionId="POS_INTERN", HireDate=new DateTime(2024,2,1),  Status="Đã nghỉ việc",   Username="binh.tt",   Role="Employee" },
            new() { EmployeeId="NV_19_V", FullName="Lý Quý Vy",         Email="vy.lq@erp.vn",       PhoneNumber="0958888888", DepartmentId="DEP_HR",  PositionId="POS_STAFF",  HireDate=new DateTime(2024,1,20), Status="Đang hoạt động", Username="vy.lq",     Role="Employee" },
            new() { EmployeeId="NV_20_Y", FullName="Phan Thị Yến",      Email="yen.pt@erp.vn",      PhoneNumber="0921111111", DepartmentId="DEP_HR",  PositionId="POS_DEPUTY", HireDate=new DateTime(2021,9,1),  Status="Đang hoạt động", Username="yen.pt",    Role="Employee" },
            new() { EmployeeId="NV_21_X", FullName="Cao Xuân Đạt",      Email="dat.cx@erp.vn",      PhoneNumber="0922222222", DepartmentId="DEP_HR",  PositionId="POS_STAFF",  HireDate=new DateTime(2023,4,1),  Status="Đang hoạt động", Username="dat.cx",    Role="Employee" },
            new() { EmployeeId="NV_22_L", FullName="Trương Ngọc Linh",  Email="linh.tn@erp.vn",     PhoneNumber="0923333333", DepartmentId="DEP_HR",  PositionId="POS_STAFF",  HireDate=new DateTime(2024,3,15), Status="Đang hoạt động", Username="linh.tn",   Role="Employee" },
            new() { EmployeeId="NV_23_H", FullName="Mai Văn Hùng",      Email="hung.mv@erp.vn",     PhoneNumber="0924444444", DepartmentId="DEP_HR",  PositionId="POS_INTERN", HireDate=new DateTime(2024,7,1),  Status="Đang hoạt động", Username="hung.mv",   Role="Employee" },
            // --- Phòng Marketing (10) ---
            new() { EmployeeId="NV_24_K", FullName="Vũ Trung Kiên",     Email="kien.vt@erp.vn",     PhoneNumber="0931111111", DepartmentId="DEP_MKT", PositionId="POS_MGR",    HireDate=new DateTime(2021,7,20), Status="Đang hoạt động", Username="kien.vt",   Role="Employee" },
            new() { EmployeeId="NV_25_H", FullName="Lê Thị Hoa",        Email="hoa.lt@erp.vn",      PhoneNumber="0932222222", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2022,9,9),  Status="Đang hoạt động", Username="hoa.lt",    Role="Employee" },
            new() { EmployeeId="NV_26_D", FullName="Phạm Văn Đạt",      Email="dat.pv@erp.vn",      PhoneNumber="0933333333", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2023,11,11),Status="Đang hoạt động", Username="dat.pv",    Role="Employee" },
            new() { EmployeeId="NV_27_N", FullName="Châu Tinh Ngân",    Email="ngan.ct@erp.vn",     PhoneNumber="0959999999", DepartmentId="DEP_MKT", PositionId="POS_INTERN", HireDate=new DateTime(2024,3,1),  Status="Đang hoạt động", Username="ngan.ct",   Role="Employee" },
            new() { EmployeeId="NV_28_T", FullName="Đỗ Minh Tâm",       Email="tam.dm@erp.vn",      PhoneNumber="0934444444", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2023,1,15), Status="Đang hoạt động", Username="tam.dm",    Role="Employee" },
            new() { EmployeeId="NV_29_L", FullName="Nguyễn Thu Lan",    Email="lan.nt@erp.vn",      PhoneNumber="0935555555", DepartmentId="DEP_MKT", PositionId="POS_DEPUTY", HireDate=new DateTime(2022,4,1),  Status="Đang hoạt động", Username="lan.nt",    Role="Employee" },
            new() { EmployeeId="NV_30_O", FullName="Trần Văn Oanh",     Email="oanh.tv@erp.vn",     PhoneNumber="0936666666", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2024,5,1),  Status="Đang hoạt động", Username="oanh.tv",   Role="Employee" },
            new() { EmployeeId="NV_31_U", FullName="Lê Quốc Uy",        Email="uy.lq@erp.vn",       PhoneNumber="0937777777", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2023,6,15), Status="Nghỉ phép",     Username="uy.lq",     Role="Employee" },
            new() { EmployeeId="NV_32_R", FullName="Phan Thanh Rạng",   Email="rang.pt@erp.vn",     PhoneNumber="0938888888", DepartmentId="DEP_MKT", PositionId="POS_INTERN", HireDate=new DateTime(2024,8,1),  Status="Đang hoạt động", Username="rang.pt",   Role="Employee" },
            new() { EmployeeId="NV_33_W", FullName="Hoàng Thị Uyên",    Email="uyen.ht@erp.vn",     PhoneNumber="0939999999", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2022,11,1), Status="Đang hoạt động", Username="uyen.ht",   Role="Employee" },
            // --- Phòng Kế Toán (9) ---
            new() { EmployeeId="NV_34_T", FullName="Hoàng Thanh Trúc",  Email="truc.ht@erp.vn",     PhoneNumber="0944444444", DepartmentId="DEP_ACC", PositionId="POS_MGR",    HireDate=new DateTime(2020,10,10),Status="Đang hoạt động", Username="truc.ht",   Role="Employee" },
            new() { EmployeeId="NV_35_Q", FullName="Bùi Hồng Quân",     Email="quan.bh@erp.vn",     PhoneNumber="0945555555", DepartmentId="DEP_ACC", PositionId="POS_ACC",    HireDate=new DateTime(2021,12,1), Status="Nghỉ phép",     Username="quan.bh",   Role="Employee" },
            new() { EmployeeId="NV_36_P", FullName="Đỗ Minh Phương",    Email="phuong.dm@erp.vn",   PhoneNumber="0946666666", DepartmentId="DEP_ACC", PositionId="POS_ACC",    HireDate=new DateTime(2023,4,30), Status="Đang hoạt động", Username="phuong.dm", Role="Employee" },
            new() { EmployeeId="NV_37_J", FullName="Nguyễn Thị Hằng",   Email="hang.nt@erp.vn",     PhoneNumber="0947777777", DepartmentId="DEP_ACC", PositionId="POS_DEPUTY", HireDate=new DateTime(2021,3,1),  Status="Đang hoạt động", Username="hang.nt",   Role="Employee" },
            new() { EmployeeId="NV_38_I", FullName="Lê Đức Thịnh",      Email="thinh.ld@erp.vn",    PhoneNumber="0948888888", DepartmentId="DEP_ACC", PositionId="POS_ACC",    HireDate=new DateTime(2022,7,1),  Status="Đang hoạt động", Username="thinh.ld",  Role="Employee" },
            new() { EmployeeId="NV_39_Z", FullName="Trần Minh Châu",    Email="chau.tm@erp.vn",     PhoneNumber="0949999999", DepartmentId="DEP_ACC", PositionId="POS_STAFF",  HireDate=new DateTime(2023,10,1), Status="Đang hoạt động", Username="chau.tm",   Role="Employee" },
            new() { EmployeeId="NV_40_W", FullName="Phạm Thị Ngọc",     Email="ngoc.pt@erp.vn",     PhoneNumber="0950000000", DepartmentId="DEP_ACC", PositionId="POS_ACC",    HireDate=new DateTime(2024,1,15), Status="Đang hoạt động", Username="ngoc.pt",   Role="Employee" },
            new() { EmployeeId="NV_41_O", FullName="Vũ Đình Toàn",      Email="toan.vd@erp.vn",     PhoneNumber="0951111111", DepartmentId="DEP_ACC", PositionId="POS_INTERN", HireDate=new DateTime(2024,6,15), Status="Đang hoạt động", Username="toan.vd",   Role="Employee" },
            new() { EmployeeId="NV_42_X", FullName="Ngô Thanh Xuân",    Email="xuan.nt@erp.vn",     PhoneNumber="0952222222", DepartmentId="DEP_ACC", PositionId="POS_ACC",    HireDate=new DateTime(2023,8,1),  Status="Đã nghỉ việc",   Username="xuan.nt",   Role="Employee" },
            // --- Bổ sung thêm (8 người nữa) ---
            new() { EmployeeId="NV_43_A", FullName="Trần Hoàng An",     Email="an.th@erp.vn",       PhoneNumber="0953333333", DepartmentId="DEP_IT",  PositionId="POS_MGR",    HireDate=new DateTime(2021,1,10), Status="Đang hoạt động", Username="an.th",     Role="Employee" },
            new() { EmployeeId="NV_44_B", FullName="Lê Thành Đạo",      Email="dao.lt@erp.vn",      PhoneNumber="0954444444", DepartmentId="DEP_IT",  PositionId="POS_NET",    HireDate=new DateTime(2023,12,1), Status="Đang hoạt động", Username="dao.lt",    Role="Employee" },
            new() { EmployeeId="NV_45_C", FullName="Hồ Bích Ngọc",      Email="ngoc.hb@erp.vn",     PhoneNumber="0955555555", DepartmentId="DEP_HR",  PositionId="POS_STAFF",  HireDate=new DateTime(2022,5,20), Status="Đang hoạt động", Username="ngoc.hb",   Role="Employee" },
            new() { EmployeeId="NV_46_D", FullName="Đặng Hữu Phước",    Email="phuoc.dh@erp.vn",    PhoneNumber="0956666666", DepartmentId="DEP_MKT", PositionId="POS_STAFF",  HireDate=new DateTime(2023,3,1),  Status="Đang hoạt động", Username="phuoc.dh",  Role="Employee" },
            new() { EmployeeId="NV_47_E", FullName="Cao Thị Thanh",     Email="thanh.ct@erp.vn",    PhoneNumber="0965555555", DepartmentId="DEP_ACC", PositionId="POS_STAFF",  HireDate=new DateTime(2024,4,1),  Status="Đang hoạt động", Username="thanh.ct",  Role="Employee" },
            new() { EmployeeId="NV_48_F", FullName="Mai Quang Vinh",    Email="vinh.mq@erp.vn",     PhoneNumber="0966666666", DepartmentId="DEP_IT",  PositionId="POS_AI",     HireDate=new DateTime(2024,5,15), Status="Đang hoạt động", Username="vinh.mq",   Role="Employee" },
            new() { EmployeeId="NV_49_G", FullName="Trương Công Danh",  Email="danh.tc@erp.vn",     PhoneNumber="0967777777", DepartmentId="DEP_BOD", PositionId="POS_STAFF",  HireDate=new DateTime(2022,2,1),  Status="Đang hoạt động", Username="danh.tc",   Role="Employee" },
            new() { EmployeeId="NV_50_H", FullName="Nguyễn Minh Hiếu", Email="hieu.nm@erp.vn",     PhoneNumber="0968888888", DepartmentId="DEP_IT",  PositionId="POS_INTERN", HireDate=new DateTime(2024,9,1),  Status="Đang hoạt động", Username="hieu.nm",   Role="Employee" },
        };
        // Gán PasswordHash mặc định (tên đăng nhập = mật khẩu) cho tất cả nhân viên
        foreach (var e in employees)
        {
            e.PasswordHash = BCrypt.Net.BCrypt.HashPassword(e.Username ?? "123456");
        }
        context.Employees.AddRange(employees);

        // ===== 4. VẬT TƯ / THIẾT BỊ (35) =====
        var assets = new List<Asset>
        {
            // --- Thiết bị IT ---
            new() { AssetId="VT_001", AssetName="Laptop Dell XPS 15",        Category="Thiết bị IT",    Quantity=12, Unit="cái",  UnitPrice=32000000,  DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2023,1,15),  Description="Core i7 Gen 13, RAM 16GB, SSD 512GB" },
            new() { AssetId="VT_002", AssetName="Laptop MacBook Pro M3",     Category="Thiết bị IT",    Quantity=5,  Unit="cái",  UnitPrice=45000000,  DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2024,3,1),   Description="MacBook Pro 14 inch, 16GB RAM" },
            new() { AssetId="VT_003", AssetName="Màn hình Dell 27 inch 4K",  Category="Thiết bị IT",    Quantity=15, Unit="cái",  UnitPrice=9500000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2023,6,10),  Description="Dell UltraSharp U2723QE" },
            new() { AssetId="VT_004", AssetName="Bàn phím cơ Logitech MX",   Category="Thiết bị IT",    Quantity=20, Unit="cái",  UnitPrice=2800000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2023,6,10),  Description="Bàn phím cơ không dây, switch Brown" },
            new() { AssetId="VT_005", AssetName="Chuột Logitech MX Master",  Category="Thiết bị IT",    Quantity=20, Unit="cái",  UnitPrice=1900000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2023,6,10),  Description="Chuột không dây Ergonomic" },
            new() { AssetId="VT_006", AssetName="Tai nghe Sony WH-1000XM5",  Category="Thiết bị IT",    Quantity=8,  Unit="cái",  UnitPrice=7500000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2024,1,20),  Description="Tai nghe chống ồn chủ động" },
            new() { AssetId="VT_007", AssetName="USB Flash 64GB Kingston",    Category="Thiết bị IT",    Quantity=30, Unit="cái",  UnitPrice=250000,    DepartmentId="DEP_IT",  Status="Trong kho",    PurchaseDate=new DateTime(2024,2,1),   Description="USB 3.2 tốc độ cao" },
            new() { AssetId="VT_008", AssetName="Laptop HP ProBook 450 G10",  Category="Thiết bị IT",    Quantity=8,  Unit="cái",  UnitPrice=18000000,  DepartmentId="DEP_HR",  Status="Đang sử dụng", PurchaseDate=new DateTime(2023,4,1),   Description="Core i5 Gen 13, RAM 8GB" },
            new() { AssetId="VT_009", AssetName="Laptop Lenovo ThinkPad",     Category="Thiết bị IT",    Quantity=6,  Unit="cái",  UnitPrice=22000000,  DepartmentId="DEP_ACC", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,5,15),  Description="ThinkPad T14s Gen 4" },
            new() { AssetId="VT_010", AssetName="Máy in HP LaserJet Pro",     Category="Thiết bị IT",    Quantity=3,  Unit="cái",  UnitPrice=8500000,   DepartmentId="DEP_HR",  Status="Đang sử dụng", PurchaseDate=new DateTime(2022,8,1),   Description="Máy in laser đen trắng, in 2 mặt" },
            new() { AssetId="VT_011", AssetName="Máy in màu Canon PIXMA",    Category="Thiết bị IT",    Quantity=2,  Unit="cái",  UnitPrice=12000000,  DepartmentId="DEP_MKT", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,2,20),  Description="Máy in phun màu khổ A3" },
            new() { AssetId="VT_012", AssetName="Router WiFi 6 TP-Link",     Category="Thiết bị IT",    Quantity=5,  Unit="cái",  UnitPrice=3200000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2023,9,1),   Description="WiFi 6, dual-band, coverage 200m²" },
            // --- Văn phòng phẩm ---
            new() { AssetId="VT_013", AssetName="Giấy in A4 Double A",       Category="Văn phòng phẩm", Quantity=200,Unit="ram",  UnitPrice=85000,     DepartmentId="DEP_HR",  Status="Trong kho",    PurchaseDate=new DateTime(2024,6,1),   Description="80gsm, 500 tờ/ram" },
            new() { AssetId="VT_014", AssetName="Bút bi Thiên Long TL-027",  Category="Văn phòng phẩm", Quantity=500,Unit="cây",  UnitPrice=5000,      DepartmentId="DEP_HR",  Status="Trong kho",    PurchaseDate=new DateTime(2024,6,1),   Description="Mực xanh, nét 0.7mm" },
            new() { AssetId="VT_015", AssetName="Kẹp giấy Binder Clip",      Category="Văn phòng phẩm", Quantity=100,Unit="hộp",  UnitPrice=15000,     DepartmentId="DEP_ACC", Status="Trong kho",    PurchaseDate=new DateTime(2024,5,15),  Description="Kẹp giấy 32mm, 12 cái/hộp" },
            new() { AssetId="VT_016", AssetName="Mực in HP 05A",             Category="Văn phòng phẩm", Quantity=10, Unit="hộp",  UnitPrice=950000,    DepartmentId="DEP_HR",  Status="Trong kho",    PurchaseDate=new DateTime(2024,4,1),   Description="Mực in chính hãng HP LaserJet" },
            new() { AssetId="VT_017", AssetName="Sổ tay A5 bìa cứng",       Category="Văn phòng phẩm", Quantity=50, Unit="quyển",UnitPrice=45000,     DepartmentId="DEP_MKT", Status="Trong kho",    PurchaseDate=new DateTime(2024,3,15),  Description="200 trang, giấy kẻ ô vuông" },
            new() { AssetId="VT_018", AssetName="Bảng flipchart di động",    Category="Văn phòng phẩm", Quantity=3,  Unit="cái",  UnitPrice=850000,    DepartmentId="DEP_MKT", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,7,1),   Description="Bảng lật 70x100cm, có chân đế" },
            // --- Nội thất ---
            new() { AssetId="VT_019", AssetName="Bàn làm việc 1m4",          Category="Nội thất",       Quantity=40, Unit="cái",  UnitPrice=3500000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2022,1,10),  Description="Bàn gỗ MDF, chân sắt, có ngăn kéo" },
            new() { AssetId="VT_020", AssetName="Ghế xoay văn phòng",        Category="Nội thất",       Quantity=50, Unit="cái",  UnitPrice=2800000,   DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2022,1,10),  Description="Ghế lưới, tựa đầu, tay vịn điều chỉnh" },
            new() { AssetId="VT_021", AssetName="Ghế giám đốc da cao cấp",   Category="Nội thất",       Quantity=2,  Unit="cái",  UnitPrice=12000000,  DepartmentId="DEP_BOD", Status="Đang sử dụng", PurchaseDate=new DateTime(2020,1,5),   Description="Ghế da thật, massage, nệm cao su" },
            new() { AssetId="VT_022", AssetName="Tủ hồ sơ 4 ngăn",           Category="Nội thất",       Quantity=10, Unit="cái",  UnitPrice=4200000,   DepartmentId="DEP_HR",  Status="Đang sử dụng", PurchaseDate=new DateTime(2021,6,1),   Description="Tủ sắt sơn tĩnh điện, có khóa" },
            new() { AssetId="VT_023", AssetName="Kệ sách 5 tầng",            Category="Nội thất",       Quantity=8,  Unit="cái",  UnitPrice=1800000,   DepartmentId="DEP_MKT", Status="Đang sử dụng", PurchaseDate=new DateTime(2022,3,15),  Description="Kệ gỗ MDF, sơn PU chống ẩm" },
            new() { AssetId="VT_024", AssetName="Bàn họp 12 chỗ",            Category="Nội thất",       Quantity=3,  Unit="cái",  UnitPrice=15000000,  DepartmentId="DEP_BOD", Status="Đang sử dụng", PurchaseDate=new DateTime(2021,2,1),   Description="Bàn oval gỗ sồi, ổ điện âm bàn" },
            new() { AssetId="VT_025", AssetName="Sofa phòng khách 3 chỗ",    Category="Nội thất",       Quantity=2,  Unit="bộ",   UnitPrice=8500000,   DepartmentId="DEP_BOD", Status="Đang sử dụng", PurchaseDate=new DateTime(2020,6,1),   Description="Sofa da PU, màu nâu, kèm bàn trà" },
            // --- Phương tiện ---
            new() { AssetId="VT_026", AssetName="Máy chiếu Epson EB-X51",    Category="Phương tiện",    Quantity=4,  Unit="cái",  UnitPrice=11000000,  DepartmentId="DEP_MKT", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,1,10),  Description="3800 lumens, XGA, HDMI" },
            new() { AssetId="VT_027", AssetName="Điều hoà Daikin 12000BTU",   Category="Phương tiện",    Quantity=15, Unit="cái",  UnitPrice=12500000,  DepartmentId="DEP_IT",  Status="Đang sử dụng", PurchaseDate=new DateTime(2022,5,1),   Description="Inverter, tiết kiệm điện" },
            new() { AssetId="VT_028", AssetName="Camera an ninh Hikvision",   Category="Phương tiện",    Quantity=20, Unit="cái",  UnitPrice=2500000,   DepartmentId="DEP_HR",  Status="Đang sử dụng", PurchaseDate=new DateTime(2022,8,15),  Description="Camera IP 2MP, quay đêm, lưu cloud" },
            new() { AssetId="VT_029", AssetName="Xe ô tô Toyota Camry",      Category="Phương tiện",    Quantity=2,  Unit="chiếc",UnitPrice=1100000000,DepartmentId="DEP_BOD", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,6,1),   Description="Camry 2.5Q, dùng đưa đón Giám đốc" },
            new() { AssetId="VT_030", AssetName="Tivi Samsung 65 inch 4K",    Category="Phương tiện",    Quantity=3,  Unit="cái",  UnitPrice=18000000,  DepartmentId="DEP_MKT", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,4,15),  Description="Smart TV, dùng phòng họp & showroom" },
            // --- Bổ sung thêm ---
            new() { AssetId="VT_031", AssetName="Máy hủy giấy Deli",         Category="Phương tiện",    Quantity=3,  Unit="cái",  UnitPrice=3200000,   DepartmentId="DEP_ACC", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,3,1),   Description="Hủy 10 tờ/lần, hủy thẻ tín dụng" },
            new() { AssetId="VT_032", AssetName="Két sắt điện tử Honeywell", Category="Phương tiện",    Quantity=2,  Unit="cái",  UnitPrice=8500000,   DepartmentId="DEP_ACC", Status="Đang sử dụng", PurchaseDate=new DateTime(2021,9,1),   Description="Chống cháy 1h, mã số + vân tay" },
            new() { AssetId="VT_033", AssetName="Máy scan HP ScanJet Pro",    Category="Thiết bị IT",    Quantity=2,  Unit="cái",  UnitPrice=9800000,   DepartmentId="DEP_ACC", Status="Đang sử dụng", PurchaseDate=new DateTime(2023,7,15),  Description="Scan 2 mặt tự động, 40 trang/phút" },
            new() { AssetId="VT_034", AssetName="Bình nước nóng lạnh",        Category="Nội thất",       Quantity=5,  Unit="cái",  UnitPrice=3500000,   DepartmentId="DEP_HR",  Status="Đang sử dụng", PurchaseDate=new DateTime(2022,10,1),  Description="Bình lọc RO 3 vòi, dùng chung" },
            new() { AssetId="VT_035", AssetName="Máy chấm công vân tay",     Category="Phương tiện",    Quantity=3,  Unit="cái",  UnitPrice=4500000,   DepartmentId="DEP_HR",  Status="Hỏng",         PurchaseDate=new DateTime(2021,4,1),   Description="ZKTeco K40, 1 cái đã hỏng cảm biến" },
        };
        context.Assets.AddRange(assets);

        // ===== 5. CHẤM CÔNG (Tuần 13) =====
        var attendances = new List<Attendance>();
        var employeeIds = new[] { "NV_01_L","NV_02_H","NV_03_T","NV_04_M","NV_05_D","NV_06_K","NV_07_A","NV_08_V","NV_09_P","NV_10_S",
                                   "NV_11_B","NV_12_T","NV_13_N","NV_14_H","NV_15_Q","NV_16_L","NV_17_T","NV_18_H","NV_19_D","NV_20_P" };
        var statuses = new[] { "Đúng giờ", "Đúng giờ", "Đúng giờ", "Đúng giờ", "Đi trễ", "Vắng mặt", "Đúng giờ", "Đi trễ", "Nghỉ phép", "Đúng giờ" };
        var random = new Random(42);

        for (int dayOffset = 0; dayOffset < 20; dayOffset++)
        {
            var date = DateTime.Today.AddDays(-dayOffset);
            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday) continue;

            foreach (var empId in employeeIds)
            {
                var statusIdx = random.Next(statuses.Length);
                var st = statuses[statusIdx];
                DateTime? checkIn = null, checkOut = null;
                string? note = null;

                if (st == "Đúng giờ")
                {
                    checkIn = date.AddHours(7).AddMinutes(45 + random.Next(15));
                    checkOut = date.AddHours(17).AddMinutes(random.Next(30));
                }
                else if (st == "Đi trễ")
                {
                    checkIn = date.AddHours(8).AddMinutes(30 + random.Next(60));
                    checkOut = date.AddHours(17).AddMinutes(15 + random.Next(30));
                    note = "Kẹt xe / Lý do cá nhân";
                }
                else if (st == "Vắng mặt")
                {
                    note = "Không phép";
                }
                else if (st == "Nghỉ phép")
                {
                    note = "Đã có đơn xin nghỉ";
                }

                attendances.Add(new Attendance
                {
                    EmployeeId = empId,
                    Date = date,
                    CheckIn = checkIn,
                    CheckOut = checkOut,
                    Status = st,
                    Note = note
                });
            }
        }
        context.Attendances.AddRange(attendances);

        // ===== 6. ĐƠN XIN NGHỈ PHÉP (Tuần 13) =====
        var leaveRequests = new List<LeaveRequest>
        {
            new() { EmployeeId="NV_04_M", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(-15), EndDate=DateTime.Today.AddDays(-14), Reason="Đi du lịch gia đình",                  Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-20) },
            new() { EmployeeId="NV_05_D", LeaveType="Nghỉ ốm",           StartDate=DateTime.Today.AddDays(-10), EndDate=DateTime.Today.AddDays(-8),  Reason="Bị cảm sốt, có giấy bệnh viện",       Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-12) },
            new() { EmployeeId="NV_06_K", LeaveType="Nghỉ không lương",   StartDate=DateTime.Today.AddDays(-7),  EndDate=DateTime.Today.AddDays(-5),  Reason="Về quê giải quyết việc gia đình",      Status="Đã duyệt",  ApprovedBy="NV_02_H", CreatedAt=DateTime.Today.AddDays(-10) },
            new() { EmployeeId="NV_07_A", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(-3),  EndDate=DateTime.Today.AddDays(-2),  Reason="Nghỉ ngơi cá nhân",                    Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-5) },
            new() { EmployeeId="NV_08_V", LeaveType="Nghỉ việc riêng",   StartDate=DateTime.Today.AddDays(-1),  EndDate=DateTime.Today.AddDays(-1),  Reason="Đưa con đi khám bệnh",                Status="Đã duyệt",  ApprovedBy="NV_02_H", CreatedAt=DateTime.Today.AddDays(-3) },
            new() { EmployeeId="NV_09_P", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(2),   EndDate=DateTime.Today.AddDays(4),   Reason="Đi công tác kết hợp nghỉ phép",        Status="Chờ duyệt",  CreatedAt=DateTime.Today.AddDays(-1) },
            new() { EmployeeId="NV_10_S", LeaveType="Nghỉ ốm",           StartDate=DateTime.Today.AddDays(1),   EndDate=DateTime.Today.AddDays(2),   Reason="Đau răng, cần đi nhổ",                 Status="Chờ duyệt",  CreatedAt=DateTime.Today },
            new() { EmployeeId="NV_11_B", LeaveType="Nghỉ không lương",   StartDate=DateTime.Today.AddDays(5),   EndDate=DateTime.Today.AddDays(7),   Reason="Tham dự đám cưới anh/chị ở Đà Nẵng",   Status="Chờ duyệt",  CreatedAt=DateTime.Today },
            new() { EmployeeId="NV_12_T", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(3),   EndDate=DateTime.Today.AddDays(3),   Reason="Đi hiến máu nhân đạo",                 Status="Chờ duyệt",  CreatedAt=DateTime.Today.AddDays(-1) },
            new() { EmployeeId="NV_13_N", LeaveType="Nghỉ việc riêng",   StartDate=DateTime.Today.AddDays(-5),  EndDate=DateTime.Today.AddDays(-5),  Reason="Gia đình có tang",                     Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-7) },
            new() { EmployeeId="NV_14_H", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(-20), EndDate=DateTime.Today.AddDays(-18), Reason="Đi phỏng vấn khóa học MBA",            Status="Từ chối",    ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-25) },
            new() { EmployeeId="NV_15_Q", LeaveType="Nghỉ ốm",           StartDate=DateTime.Today.AddDays(-12), EndDate=DateTime.Today.AddDays(-11), Reason="Ngộ độc thực phẩm",                    Status="Đã duyệt",  ApprovedBy="NV_02_H", CreatedAt=DateTime.Today.AddDays(-14) },
            new() { EmployeeId="NV_16_L", LeaveType="Nghỉ không lương",   StartDate=DateTime.Today.AddDays(10),  EndDate=DateTime.Today.AddDays(14),  Reason="Đi du lịch nước ngoài",                Status="Chờ duyệt",  CreatedAt=DateTime.Today.AddDays(-2) },
            new() { EmployeeId="NV_17_T", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(-8),  EndDate=DateTime.Today.AddDays(-6),  Reason="Về quê ăn giỗ",                        Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-12) },
            new() { EmployeeId="NV_18_H", LeaveType="Nghỉ ốm",           StartDate=DateTime.Today.AddDays(-2),  EndDate=DateTime.Today.AddDays(-1),  Reason="Bị COVID, tự cách ly tại nhà",         Status="Đã duyệt",  ApprovedBy="NV_02_H", CreatedAt=DateTime.Today.AddDays(-4) },
            new() { EmployeeId="NV_19_D", LeaveType="Nghỉ việc riêng",   StartDate=DateTime.Today.AddDays(6),   EndDate=DateTime.Today.AddDays(6),   Reason="Dọn nhà mới",                          Status="Chờ duyệt",  CreatedAt=DateTime.Today },
            new() { EmployeeId="NV_20_P", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(-25), EndDate=DateTime.Today.AddDays(-22), Reason="Nghỉ Tết dương lịch",                  Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-30) },
            new() { EmployeeId="NV_04_M", LeaveType="Nghỉ không lương",   StartDate=DateTime.Today.AddDays(8),   EndDate=DateTime.Today.AddDays(9),   Reason="Đi thi chứng chỉ AWS",                Status="Chờ duyệt",  CreatedAt=DateTime.Today.AddDays(-1) },
            new() { EmployeeId="NV_06_K", LeaveType="Nghỉ ốm",           StartDate=DateTime.Today.AddDays(-18), EndDate=DateTime.Today.AddDays(-17), Reason="Viêm họng cấp",                        Status="Từ chối",    ApprovedBy="NV_02_H", CreatedAt=DateTime.Today.AddDays(-20) },
            new() { EmployeeId="NV_11_B", LeaveType="Nghỉ phép năm",     StartDate=DateTime.Today.AddDays(-30), EndDate=DateTime.Today.AddDays(-28), Reason="Đi du lịch Phú Quốc",                  Status="Đã duyệt",  ApprovedBy="NV_01_L", CreatedAt=DateTime.Today.AddDays(-35) },
        };
        context.LeaveRequests.AddRange(leaveRequests);

        await context.SaveChangesAsync();
    }
}
