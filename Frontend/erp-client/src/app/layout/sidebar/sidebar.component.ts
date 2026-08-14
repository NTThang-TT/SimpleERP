import { Component, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">

      <!-- Logo Area -->
      <div class="sidebar-logo">
        <div class="logo-icon">📊</div>
        <div class="logo-text" *ngIf="!collapsed()">
          <span class="logo-name">SimpleERP</span>
          <span class="logo-sub">Quản trị Doanh nghiệp</span>
        </div>
      </div>

      <!-- Collapse Toggle -->
      <button class="collapse-btn" (click)="toggle()" [title]="collapsed() ? 'Mở rộng menu' : 'Thu gọn menu'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          [class.rotated]="collapsed()">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-title" *ngIf="!collapsed()">MENU CHÍNH</div>
        <div class="nav-section-title nav-section-title--collapsed" *ngIf="collapsed()">•••</div>
        <ul class="nav-list">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Dashboard' : ''">
              <span class="nav-icon">📈</span>
              <span class="nav-label" *ngIf="!collapsed()">Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/nhan-vien" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Nhân viên' : ''">
              <span class="nav-icon">👥</span>
              <span class="nav-label" *ngIf="!collapsed()">Nhân viên</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/phong-ban" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Phòng ban' : ''">
              <span class="nav-icon">🏢</span>
              <span class="nav-label" *ngIf="!collapsed()">Phòng ban</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/vat-tu" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Vật tư' : ''">
              <span class="nav-icon">📦</span>
              <span class="nav-label" *ngIf="!collapsed()">Vật tư</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/cham-cong" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Chấm công' : ''">
              <span class="nav-icon">🕐</span>
              <span class="nav-label" *ngIf="!collapsed()">Chấm công</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/nghi-phep" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Nghỉ phép' : ''">
              <span class="nav-icon">📋</span>
              <span class="nav-label" *ngIf="!collapsed()">Nghỉ phép</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- User Footer -->
      <div class="sidebar-footer">
        <div class="user-card" [title]="collapsed() ? userName + ' (' + userRole + ')' : ''">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-info" *ngIf="!collapsed()">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()" [title]="collapsed() ? 'Đăng xuất' : ''">
          <span>🚪</span>
          <span *ngIf="!collapsed()">Đăng xuất</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; }

    .sidebar {
      width: 260px;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.06);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
    }
    .sidebar.collapsed {
      width: 72px;
    }

    /* Logo */
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      min-height: 68px;
    }
    .logo-icon {
      font-size: 26px;
      flex-shrink: 0;
      width: 32px;
      text-align: center;
    }
    .logo-text { display: flex; flex-direction: column; white-space: nowrap; }
    .logo-name {
      font-size: 17px;
      font-weight: 800;
      background: linear-gradient(135deg, #818cf8, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.5px;
    }
    .logo-sub { font-size: 10px; color: #64748b; font-weight: 500; margin-top: 1px; }

    /* Collapse Button */
    .collapse-btn {
      position: absolute;
      top: 76px;
      right: -12px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #1e293b;
      border: 2px solid #334155;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;
      padding: 0;
    }
    .collapse-btn:hover {
      background: #334155;
      color: #e2e8f0;
      border-color: #6366f1;
      transform: scale(1.1);
    }
    .collapse-btn svg {
      transition: transform 0.3s ease;
    }
    .collapse-btn svg.rotated {
      transform: rotate(180deg);
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 16px 10px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .nav-section-title {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 1.5px;
      padding: 0 12px;
      margin-bottom: 12px;
      white-space: nowrap;
    }
    .nav-section-title--collapsed {
      text-align: center;
      padding: 0;
      letter-spacing: 3px;
    }
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 12px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      white-space: nowrap;
    }
    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 12px;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: #e2e8f0;
      transform: translateX(2px);
    }
    .sidebar.collapsed .nav-item:hover {
      transform: none;
    }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%);
      color: #a5b4fc;
      font-weight: 600;
      box-shadow: inset 3px 0 0 #818cf8;
    }
    .sidebar.collapsed .nav-item.active {
      box-shadow: none;
      border: 1px solid rgba(99,102,241,0.3);
    }
    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }
    .nav-label { white-space: nowrap; }

    /* Footer / User Area */
    .sidebar-footer {
      padding: 14px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .sidebar.collapsed .user-card {
      padding: 8px;
      justify-content: center;
    }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: white;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(99,102,241,0.3);
    }
    .user-info { display: flex; flex-direction: column; overflow: hidden; }
    .user-name {
      font-size: 12px;
      font-weight: 600;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role { font-size: 10px; color: #64748b; font-weight: 500; }

    .logout-btn {
      width: 100%;
      padding: 9px 12px;
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 10px;
      background: rgba(239,68,68,0.08);
      color: #f87171;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .sidebar.collapsed .logout-btn {
      padding: 9px;
    }
    .logout-btn:hover {
      background: rgba(239,68,68,0.18);
      border-color: rgba(239,68,68,0.5);
      transform: translateY(-1px);
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Two-way binding with parent via model signal */
  collapsed = model<boolean>(false);

  toggle() {
    this.collapsed.update(v => !v);
  }

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
