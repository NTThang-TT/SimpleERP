import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar flex flex-col h-screen w-64 bg-gray-900 text-white shadow-xl">
      <div class="logo-area p-6 flex items-center justify-center border-b border-gray-800">
        <h2 class="text-2xl font-bold tracking-wider text-blue-400">SimpleERP</h2>
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-2 px-3">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
              <i class="fas fa-chart-line w-5"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/nhan-su" routerLinkActive="active" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
              <i class="fas fa-users w-5"></i>
              <span>Nhân sự</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/phong-ban" routerLinkActive="active" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
              <i class="fas fa-building w-5"></i>
              <span>Phòng ban</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/chuc-vu" routerLinkActive="active" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
              <i class="fas fa-briefcase w-5"></i>
              <span>Chức vụ</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="user-area p-4 border-t border-gray-800">
        <button (click)="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .active {
      background-color: rgba(31, 41, 55, 1); /* bg-gray-800 */
      color: white;
      border-left: 4px solid #3b82f6; /* blue-500 */
    }
  `]
})
export class SidebarComponent {
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}
