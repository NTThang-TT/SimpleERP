import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Header -->
        <header class="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-800">Quản trị hệ thống</h1>
          <div class="flex items-center gap-4">
            <div class="relative">
              <i class="fas fa-bell text-gray-500 hover:text-blue-500 cursor-pointer text-xl"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            <div class="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        <!-- Main Page Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <!-- Outlet render các trang con (Dashboard, NhanSu, ...) -->
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
}
