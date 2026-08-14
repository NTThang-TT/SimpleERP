import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./hr-dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent)
      },
      {
        path: 'nhan-vien',
        loadComponent: () => import('./pages/employee/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'phong-ban',
        loadComponent: () => import('./pages/department/department-list.component').then(m => m.DepartmentListComponent)
      },
      {
        path: 'vat-tu',
        loadComponent: () => import('./pages/asset/asset-list.component').then(m => m.AssetListComponent)
      },
      {
        path: 'cham-cong',
        loadComponent: () => import('./pages/attendance/attendance-list.component').then(m => m.AttendanceListComponent)
      },
      {
        path: 'nghi-phep',
        loadComponent: () => import('./pages/leave-request/leave-request-list.component').then(m => m.LeaveRequestListComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/dashboard' }
];