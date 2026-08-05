import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Reusable Component — Search Bar (Tuần 10 tích hợp)
import { SearchBarComponent } from '../shared/search-bar/search-bar';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) {
    return { futureDate: true };
  }
  return null;
}
import { EmployeeService } from '../services/employee.service';
import { DepartmentService } from '../services/department.service';
import { PositionService } from '../services/position.service';
import { EmployeeDTO, Department, Position } from '../models/employee-dto.model';
import { EmployeeStateService } from '../store/employee.state';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SearchBarComponent],
  template: `
    <div class="min-h-screen bg-slate-50/50 relative">
      
      <!-- Top Navigation/Header -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="px-6 sm:px-8 max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <span class="text-xl">📊</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-slate-800 leading-tight">HR Dashboard</h1>
                <p class="text-xs text-slate-500 font-medium">Quản lý Nhân sự</p>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-2 border-l border-slate-200 pl-6">
              <a routerLink="/hr-dashboard" class="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg transition-colors">👥 Nhân sự</a>
            </nav>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden lg:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data: SQL Server
            </div>
            <button
              (click)="onLogout()"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors"
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Welcome Section -->
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Tổng quan Nhân sự</h2>
            <p class="text-slate-500 mt-1">Theo dõi tình hình biến động nhân sự trực tiếp từ hệ thống.</p>
          </div>
          <div class="flex items-center gap-4">
            @if (isAdminOrHR()) {
              <a routerLink="/admin/employee" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
                Quản lý Nhân sự ➔
              </a>
            }
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <!-- Card 1 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Tổng nhân viên</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ totalCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">👥</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-1 rounded-md">
              <span>↗</span> <span>Cập nhật mới</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Đang hoạt động</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ activeCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✅</div>
      
              </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              Tình trạng làm việc bình thường
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Nghỉ phép</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ onLeaveCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⛱️</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              Tạm thời vắng mặt
            </div>
          </div>

          <!-- Card 4 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Đã nghỉ việc</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ inactiveCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">🚫</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              Đã chấm dứt hợp đồng
            </div>
          </div>
        </div>

        <!-- Removed Employee Table (Moved to EmployeeListComponent) -->
        <div class="mt-8 text-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-800">Quản lý Nhân sự Chi tiết</h3>
          <p class="text-slate-500 mt-2 mb-4">Vui lòng truy cập trang Nhân viên để xem danh sách chi tiết, thêm mới, hoặc chỉnh sửa thông tin.</p>
          <a routerLink="/admin/employee" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors">
            Chuyển đến Nhân viên ➔
          </a>
        </div>
        
        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-slate-600 text-xs">
            HRM System — Fullstack .NET 10 + Angular (Role Based UI)
          </p>
        </div>
      </main>
    </div>

    <!-- Removed Modal Form from Dashboard -->
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HrDashboardComponent implements OnInit {

  // ==========================================
  // DEPENDENCY INJECTION
  // ==========================================
  private employeeState = inject(EmployeeStateService);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private positionService = inject(PositionService);
  private router = inject(Router);

  // ==========================================
  // STATE MANAGEMENT BẰNG SIGNALS
  // ==========================================
  // State Signals từ Store (Chỉ đọc)
  employees = this.employeeState.employees;
  isLoading = this.employeeState.isLoading;
  errorMessage = this.employeeState.errorMessage;
  
  totalCount = this.employeeState.totalCount;
  activeCount = this.employeeState.activeCount;
  onLeaveCount = this.employeeState.onLeaveCount;
  inactiveCount = this.employeeState.inactiveCount;
  uniqueDepartments = this.employeeState.uniqueDepartments;

  pageNumber = this.employeeState.pageNumber;
  pageSize = this.employeeState.pageSize;
  totalPages = this.employeeState.totalPages;
  searchTerm = this.employeeState.searchTerm;
  departmentId = this.employeeState.departmentId;

  // Local UI State
  isSidebarCollapsed = signal(false);

  // Lookup data for Select dropdowns
  departments = signal<Department[]>([]);
  positions = signal<Position[]>([]);

  // Modal State
  isModalOpen = signal(false);
  isEditMode = signal(false);
  isSaving = signal(false);
  formError = signal('');
  todayDateStr = new Date().toISOString().split('T')[0];

  // === XỬ LÝ LỌC & TÌM KIẾM BẰNG BACKEND ===

  onSearch(term: string) {
    this.employeeState.updateFilters(term, this.departmentId());
  }

  onDepartmentChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.employeeState.updateFilters(this.searchTerm(), select.value);
  }

  changePage(page: number) {
    this.employeeState.changePage(page);
  }


  // ==========================================
  // FORM DEFINITION
  // ==========================================
  employeeForm = new FormGroup({
    employeeId: new FormControl(''),
    fullName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    email: new FormControl('', [Validators.maxLength(100)]),
    phoneNumber: new FormControl('', [Validators.maxLength(15)]),
    departmentId: new FormControl('', [Validators.required]),
    positionId: new FormControl('', [Validators.required]),
    hireDate: new FormControl('', [Validators.required, pastDateValidator]),
    status: new FormControl('Đang hoạt động', [Validators.required])
  });



  // ==========================================
  // ROLE-BASED UI
  // ==========================================
  private authService = inject(AuthService);
  isAdminOrHR = computed(() => {
    return this.authService.hasRole('Admin') || this.authService.hasRole('HR');
  });

  // ==========================================
  // LIFECYCLE
  // ==========================================
  ngOnInit(): void {
    this.loadData();
    this.loadLookups();
  }

  // ==========================================
  // DATA FETCHER
  // ==========================================
  loadData(): void {
    // Kích hoạt action load dữ liệu từ State Store
    this.employeeState.loadEmployees();
  }

  loadLookups(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => this.departments.set(data)
    });
    this.positionService.getAll().subscribe({
      next: (data) => this.positions.set(data)
    });
  }

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.formError.set('');
    this.employeeForm.reset({ status: 'Đang hoạt động' });
    this.isModalOpen.set(true);
  }

  openEditModal(id: string): void {
    this.isEditMode.set(true);
    this.formError.set('');
    this.isModalOpen.set(true);

    // Fetch employee details to fill the form
    this.employeeService.getById(id).subscribe({
      next: (emp) => {
        // Format Date to YYYY-MM-DD for HTML5 date input
        const dateObj = new Date(emp.hireDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        this.employeeForm.patchValue({
          employeeId: emp.employeeId,
          fullName: emp.fullName,
          email: emp.email,
          phoneNumber: emp.phoneNumber,
          departmentId: emp.departmentId,
          positionId: emp.positionId,
          hireDate: formattedDate,
          status: emp.status
        });
      },
      error: () => this.formError.set('Không thể tải thông tin nhân viên.')
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.employeeForm.reset();
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.formError.set('');

    // Get raw value to include disabled fields (like employeeId in edit mode)
    const formData = this.employeeForm.getRawValue() as any;

    if (this.isEditMode()) {
      this.employeeService.update(formData.employeeId, formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData(); // Refresh list
        },
        error: (err) => {
          this.isSaving.set(false);
          let msg = 'Đã xảy ra lỗi khi cập nhật.';
          if (err.error) {
            if (typeof err.error === 'string') msg = err.error;
            else if (err.error.message) msg = err.error.message;
            else if (err.error.errors) msg = Object.values(err.error.errors).flat().join(' | ');
            else if (err.error.title) msg = err.error.title;
          }
          this.formError.set(msg);
        }
      });
    } else {
      this.employeeService.create(formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData(); // Refresh list
        },
        error: (err) => {
          this.isSaving.set(false);
          let msg = 'Đã xảy ra lỗi khi thêm mới.';
          if (err.error) {
            if (typeof err.error === 'string') msg = err.error;
            else if (err.error.message) msg = err.error.message;
            else if (err.error.errors) msg = Object.values(err.error.errors).flat().join(' | ');
            else if (err.error.title) msg = err.error.title;
          }
          this.formError.set(msg);
        }
      });
    }
  }

  deleteEmployee(id: string): void {
    if (confirm(`Bạn có chắc chắn muốn chuyển trạng thái nhân viên ${id} thành "Đã nghỉ việc" không?`)) {
      this.employeeService.delete(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Lỗi khi xóa nhân viên.')
      });
    }
  }

  // ==========================================
  // AUTH & HELPERS
  // ==========================================
  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }


}
