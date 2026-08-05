import { Routes } from '@angular/router';
import { NhanSuComponent } from './nhan-su/nhan-su';
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
      { path: 'nhan-su', component: NhanSuComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }
];