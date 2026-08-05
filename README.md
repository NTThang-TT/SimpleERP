# 📊 SimpleERP — Mini Project

Hệ thống quản trị doanh nghiệp đơn giản (Simple ERP) — Giai đoạn 2 thực tập.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 19, TypeScript, SCSS |
| **Backend** | .NET 8 Web API, C# |
| **Database** | SQL Server, EF Core |
| **Auth** | JWT Bearer Token |

## 📁 Cấu trúc dự án

```
SimpleERP/
├── Backend/
│   ├── SimpleERP.sln
│   ├── SimpleERP.API/          ← Web API (Controllers, Middlewares)
│   ├── SimpleERP.Core/         ← Entities + Interfaces
│   ├── SimpleERP.Infrastructure/ ← EF Core, Repositories
│   └── SimpleERP.Shared/       ← DTOs, Helpers
├── Frontend/
│   └── erp-client/             ← Angular App
└── README.md
```

## 🚀 Chạy dự án

### Backend
```bash
cd Backend
dotnet run --project SimpleERP.API
# → http://localhost:5000/swagger
```

### Frontend
```bash
cd Frontend/erp-client
npm install
npm start
# → http://localhost:4200
```

## 📅 Tiến độ

- [x] **Tuần 11**: Setup Project, Solution Structure, Admin Layout, Sidebar, Dashboard
- [ ] **Tuần 12**: CRUD Modules (Nhân viên, Phòng ban, Chức vụ)
- [ ] **Tuần 13**: Nâng cao (Pagination, Search, Validation, Export)
- [ ] **Tuần 14**: Hoàn thiện & Deploy
