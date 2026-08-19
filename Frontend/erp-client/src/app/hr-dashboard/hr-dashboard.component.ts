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
import { AttendanceService, AttendanceDTO } from '../services/attendance.service';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="p-6 lg:p-8">
      <!-- Self Check-in Widget -->
      <div class="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 class="text-xl font-bold mb-1">Chấm công hôm nay</h3>
          <p class="text-indigo-100 text-sm">Hôm nay là: {{ todayDate | date:'fullDate':'':'vi-VN' }}</p>
        </div>
        <div class="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          @if (attendanceLoading()) {
            <span class="text-indigo-100">Đang kiểm tra...</span>
          } @else if (!myTodayAttendance()) {
            <div class="text-right mr-2">
              <div class="text-sm text-indigo-100 mb-0.5">Bạn chưa chấm công</div>
            </div>
            <button (click)="doCheckIn()" [disabled]="actionLoading()"
              class="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2">
              <span>🎯</span> Check In
            </button>
          } @else if (myTodayAttendance() && !myTodayAttendance()!.checkOut) {
            <div class="text-right mr-2">
              <div class="text-sm text-indigo-100 mb-0.5">Đã Check-in lúc:</div>
              <div class="font-bold">{{ myTodayAttendance()!.checkIn | date:'HH:mm' }}</div>
            </div>
            <button (click)="doCheckOut()" [disabled]="actionLoading()"
              class="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2">
              <span>🏃</span> Check Out
            </button>
          } @else {
            <div class="text-right mr-2">
              <div class="text-sm text-indigo-100 mb-0.5">Giờ làm việc:</div>
              <div class="font-bold">{{ myTodayAttendance()!.checkIn | date:'HH:mm' }} - {{ myTodayAttendance()!.checkOut | date:'HH:mm' }}</div>
            </div>
            <div class="bg-emerald-500/20 text-emerald-100 px-4 py-2.5 rounded-lg font-bold border border-emerald-500/30 flex items-center gap-2">
              <span>✅</span> Hoàn thành
            </div>
          }
        </div>
      </div>

      <!-- Welcome Section -->
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight">
            {{ isAdminOrHR() ? 'Tổng quan Nhân sự' : 'Trang chủ Nhân viên' }}
          </h2>
          <p class="text-slate-500 mt-1">
            {{ isAdminOrHR() ? 'Theo dõi tình hình biến động nhân sự trực tiếp từ hệ thống.' : 'Chào mừng bạn đến với SimpleERP.' }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          @if (isAdminOrHR()) {
            <a routerLink="/admin/nhan-vien" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
              Quản lý Nhân sự ➤
            </a>
          }
        </div>
      </div>

      <!-- KPI Cards -->
      @if (isAdminOrHR()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">Đang hoạt động</p>
              <h3 class="text-3xl font-bold text-slate-800">{{ activeCount() }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✅</div>
          </div>
          <div class="mt-4 text-xs text-slate-500 font-medium">Tình trạng làm việc bình thường</div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">Nghỉ phép</p>
              <h3 class="text-3xl font-bold text-slate-800">{{ onLeaveCount() }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⛱️</div>
          </div>
          <div class="mt-4 text-xs text-slate-500 font-medium">Tạm thời vắng mặt</div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">Đã nghỉ việc</p>
              <h3 class="text-3xl font-bold text-slate-800">{{ inactiveCount() }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">🚫</div>
          </div>
          <div class="mt-4 text-xs text-slate-500 font-medium">Đã chấm dứt hợp đồng</div>
        </div>
      </div>
      }

      <!-- Quick Links -->
      @if (isAdminOrHR()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a routerLink="/admin/nhan-vien" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">👥</div>
            <h4 class="text-base font-bold text-slate-800">Nhân viên</h4>
          </div>
          <p class="text-sm text-slate-500">Xem, thêm, sửa, xóa thông tin nhân viên.</p>
        </a>
        <a routerLink="/admin/phong-ban" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🏢</div>
            <h4 class="text-base font-bold text-slate-800">Phòng ban</h4>
          </div>
          <p class="text-sm text-slate-500">Quản lý cơ cấu tổ chức phòng ban.</p>
        </a>
        <a routerLink="/admin/vat-tu" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📦</div>
            <h4 class="text-base font-bold text-slate-800">Vật tư</h4>
          </div>
          <p class="text-sm text-slate-500">Quản lý thiết bị, vật tư công ty.</p>
        </a>
      </div>
      }
    </div>
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
  private attendanceService = inject(AttendanceService);
  private authService = inject(AuthService);
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

  // Self Attendance State
  todayDate = new Date();
  myTodayAttendance = signal<AttendanceDTO | null>(null);
  attendanceLoading = signal(true);
  actionLoading = signal(false);

  isAdminOrHR = computed(() => {
    return this.authService.hasRole('Admin') || this.authService.hasRole('HR');
  });

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

  // ==========================================
  // LIFECYCLE
  // ==========================================
  ngOnInit(): void {
    this.employeeState.loadEmployees();
    this.departmentService.getAll().subscribe(data => this.departments.set(data));
    this.positionService.getAll().subscribe(data => this.positions.set(data));
    this.loadMyAttendance();
  }

  // ==========================================
  // DATA FETCHER
  // ==========================================
  loadData() {
    this.employeeState.loadEmployees();
  }

  loadMyAttendance() {
    this.attendanceLoading.set(true);
    this.attendanceService.getMyToday().subscribe({
      next: (res) => {
        this.myTodayAttendance.set(res);
        this.attendanceLoading.set(false);
      },
      error: () => {
        this.myTodayAttendance.set(null);
        this.attendanceLoading.set(false);
      }
    });
  }

  doCheckIn() {
    this.actionLoading.set(true);
    this.attendanceService.checkIn().subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.loadMyAttendance();
      },
      error: (err) => {
        alert(err.error?.message || 'Có lỗi xảy ra');
        this.actionLoading.set(false);
      }
    });
  }

  doCheckOut() {
    this.actionLoading.set(true);
    this.attendanceService.checkOut().subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.loadMyAttendance();
      },
      error: (err) => {
        alert(err.error?.message || 'Có lỗi xảy ra');
        this.actionLoading.set(false);
      }
    });
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
