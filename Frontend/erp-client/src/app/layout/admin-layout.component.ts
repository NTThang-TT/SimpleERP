import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <app-sidebar [(collapsed)]="sidebarCollapsed"></app-sidebar>

      <!-- Main Content Area -->
      <div class="main-area" [class.sidebar-collapsed]="sidebarCollapsed()">

        <!-- Top Header -->
        <header class="top-header">
          <div class="header-left">
            <!-- Hamburger Toggle -->
            <button class="hamburger-btn" (click)="toggleSidebar()" title="Thu gọn / Mở rộng menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <!-- Breadcrumb -->
            <div class="breadcrumb">
              <span class="breadcrumb-icon">🏠</span>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">{{ currentPageTitle }}</span>
            </div>
          </div>

          <div class="header-right">
            <!-- Live Status -->
            <div class="live-badge">
              <span class="live-dot"></span>
              <span class="live-text">Live</span>
            </div>

            <!-- Theme Toggle -->
            <button class="header-icon-btn" (click)="toggleTheme()" title="Chuyển chế độ Sáng/Tối">
              @if (isDarkMode()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              }
            </button>

            <!-- User Avatar & Dropdown -->
            <div class="user-dropdown-container">
              <div class="header-user" (click)="toggleUserMenu()">
                <div class="header-user-avatar">{{ userInitials }}</div>
                <div class="header-user-info">
                  <span class="header-user-name">{{ userName }}</span>
                  <span class="header-user-role">{{ userRole }}</span>
                </div>
                <svg class="dropdown-arrow" [class.open]="isUserMenuOpen()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <!-- Dropdown Menu -->
              @if (isUserMenuOpen()) {
                <div class="user-dropdown-menu">
                  <div class="dropdown-header">
                    <div class="dropdown-name">{{ userName }}</div>
                    <div class="dropdown-email">{{ userRole }}</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" (click)="viewProfile()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Xem thông tin
                  </button>
                  <button class="dropdown-item" (click)="changePassword()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Đổi mật khẩu
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <div class="footer-inner">
            <div class="footer-left">
              <span class="footer-brand">SimpleERP</span>
              <span class="footer-sep">•</span>
              <span class="footer-text">Hệ thống Quản trị Doanh nghiệp</span>
            </div>
            <div class="footer-center">
              <span class="footer-stack">Fullstack .NET 8 + Angular 19</span>
            </div>
            <div class="footer-right">
              <span class="footer-copy">© 2026 — Tuần 12 Thực tập</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f1f5f9;
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* Main Area */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow: hidden;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ===== TOP HEADER ===== */
    .top-header {
      height: 60px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      z-index: 20;
    }

    /* Header Left */
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .hamburger-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
    }
    .hamburger-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #64748b;
    }
    .breadcrumb-icon { font-size: 16px; }
    .breadcrumb-sep { color: #cbd5e1; font-weight: 300; }
    .breadcrumb-current { font-weight: 600; color: #334155; }

    /* Header Right */
    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .live-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 20px;
      margin-right: 8px;
    }
    .live-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse-green 2s infinite;
    }
    @keyframes pulse-green {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
      50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
    }
    .live-text { font-size: 12px; font-weight: 600; color: #16a34a; }

    .header-icon-btn {
      position: relative;
      width: 38px; height: 38px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .header-icon-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #334155;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .notification-badge {
      position: absolute;
      top: -4px; right: -4px;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #f97316);
      color: white;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }

    /* Header User & Dropdown */
    .user-dropdown-container {
      position: relative;
    }
    .header-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .header-user:hover {
      background: #f8fafc;
    }
    .dropdown-arrow {
      color: #94a3b8;
      transition: transform 0.2s ease;
    }
    .dropdown-arrow.open {
      transform: rotate(180deg);
    }
    
    .user-dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      width: 240px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
      padding: 8px;
      z-index: 100;
      animation: dropdownFadeIn 0.2s ease;
    }
    @keyframes dropdownFadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dropdown-header {
      padding: 8px 12px;
    }
    .dropdown-name {
      font-weight: 600;
      color: #334155;
      font-size: 14px;
    }
    .dropdown-email {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .dropdown-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 8px 0;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      text-align: left;
      font-size: 14px;
      color: #475569;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .dropdown-item:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .dropdown-item svg {
      color: #64748b;
    }
    .dropdown-item:hover svg {
      color: #4f46e5;
    }

    .header-user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
    }
    .header-user-info { display: flex; flex-direction: column; }
    .header-user-name { font-size: 14px; font-weight: 600; color: #1e293b; }
    .header-user-role { font-size: 12px; color: #64748b; margin-top: 2px; }

    /* ===== PAGE CONTENT ===== */
    .page-content {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      background: #f1f5f9;
    }

    /* ===== FOOTER ===== */
    .app-footer {
      flex-shrink: 0;
      background: white;
      border-top: 1px solid #e2e8f0;
      padding: 0 24px;
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 44px;
      max-width: 100%;
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .footer-brand {
      font-size: 12px;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .footer-sep { color: #e2e8f0; }
    .footer-text { font-size: 11px; color: #94a3b8; }
    .footer-center { font-size: 11px; color: #94a3b8; }
    .footer-stack {
      padding: 3px 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-weight: 500;
    }
    .footer-right { font-size: 11px; color: #94a3b8; }
    .footer-copy { font-weight: 500; }

    /* Responsive */
    @media (max-width: 768px) {
      .header-user-info { display: none; }
      .live-badge { display: none; }
      .footer-center { display: none; }
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  get currentPageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('nhan-vien')) return 'Nhân viên';
    if (url.includes('phong-ban')) return 'Phòng ban';
    if (url.includes('vat-tu')) return 'Vật tư';
    if (url.includes('cham-cong')) return 'Chấm công';
    if (url.includes('nghi-phep')) return 'Nghỉ phép';
    return 'Trang chủ';
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

  // --- Theme Toggle ---
  isDarkMode = signal(false);
  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  // --- User Menu Dropdown ---
  isUserMenuOpen = signal(false);
  toggleUserMenu() {
    this.isUserMenuOpen.update(v => !v);
  }

  viewProfile() {
    this.isUserMenuOpen.set(false);
    alert('Chức năng Xem thông tin đang được phát triển!');
  }

  changePassword() {
    this.isUserMenuOpen.set(false);
    alert('Chức năng Đổi mật khẩu đang được phát triển!');
  }
}
