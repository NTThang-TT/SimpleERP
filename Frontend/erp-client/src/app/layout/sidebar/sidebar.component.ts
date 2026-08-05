import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">📊</div>
        <div class="logo-text">
          <span class="logo-name">SimpleERP</span>
          <span class="logo-sub">Quản trị Doanh nghiệp</span>
        </div>
      </div>

      <!-- Menu -->
      <nav class="sidebar-nav">
        <div class="nav-section-title">MENU CHÍNH</div>
        <ul class="nav-list">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📈</span>
              <span class="nav-label">Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/nhan-vien" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-label">Nhân viên</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/phong-ban" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🏢</span>
              <span class="nav-label">Phòng ban</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/vat-tu" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📦</span>
              <span class="nav-label">Vật tư</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- User Area -->
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">🚪 Đăng xuất</button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.06);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .logo-icon { font-size: 28px; }
    .logo-text { display: flex; flex-direction: column; }
    .logo-name { font-size: 18px; font-weight: 800; color: #818cf8; letter-spacing: 0.5px; }
    .logo-sub  { font-size: 11px; color: #64748b; font-weight: 500; margin-top: 2px; }

    .sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
    .nav-section-title {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 1.5px;
      padding: 0 12px;
      margin-bottom: 12px;
    }
    .nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.05);
      color: #e2e8f0;
    }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%);
      color: #a5b4fc;
      font-weight: 600;
      box-shadow: inset 3px 0 0 #818cf8;
    }
    .nav-icon { font-size: 18px; width: 24px; text-align: center; }
    .nav-label { white-space: nowrap; }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      margin-bottom: 12px;
    }
    .user-avatar {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: white;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .user-role { font-size: 11px; color: #64748b; font-weight: 500; }

    .logout-btn {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 10px;
      background: rgba(239,68,68,0.1);
      color: #f87171;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .logout-btn:hover {
      background: rgba(239,68,68,0.2);
      border-color: rgba(239,68,68,0.5);
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get userName(): string {
    const token = this.authService.getToken();
    if (!token) return 'User';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';
    } catch { return 'User'; }
  }

  get userRole(): string {
    const role = this.authService.getRole();
    if (role === 'Admin') return 'Quản trị viên';
    if (role === 'HR') return 'Nhân sự';
    return 'Nhân viên';
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.split('.');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
