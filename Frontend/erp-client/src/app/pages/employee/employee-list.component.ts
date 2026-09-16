import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../shared/search-bar/search-bar';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) return { futureDate: true };
  return null;
}

import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { PositionService } from '../../services/position.service';
import { Department, Position } from '../../models/employee-dto.model';
import { EmployeeStateService } from '../../store/employee.state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchBarComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden m-6">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
        <div>
          <h3 class="text-xl font-bold text-slate-800">Danh sách nhân viên</h3>
          <p class="text-sm text-slate-500 mt-1">Quản lý hồ sơ nhân sự của công ty.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- Department Filter -->
          <select class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
            (change)="onDepartmentChange($event)">
            <option value="all">Tất cả phòng ban</option>
            @for (dept of uniqueDepartments(); track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>

          <app-search-bar placeholder="Tìm kiếm nhân viên..." (searchQuery)="onSearch($event)"></app-search-bar>
          
          @if (isAdminOrHR()) {
            <button (click)="openCreateModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-md flex items-center gap-2">
              <span>➕</span> Thêm nhân viên
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex flex-col items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      }

      <!-- Data Table -->
      @if (!isLoading()) {
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Mã NV</th>
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Nhân viên</th>
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Email</th>
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Phòng ban</th>
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Chức vụ</th>
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-center">Trạng thái</th>
                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (emp of employees(); track emp.employeeId) {
                <tr class="hover:bg-slate-50 transition-colors group">
                  <td class="py-4 px-6 font-mono text-sm text-slate-600">{{ emp.employeeId }}</td>
                  <td class="py-4 px-6">
                    <div class="font-semibold text-slate-800">{{ emp.fullName }}</div>
                  </td>
                  <td class="py-4 px-6 text-sm text-slate-600">{{ emp.email }}</td>
                  <td class="py-4 px-6 text-sm font-medium text-slate-700">{{ emp.departmentName }}</td>
                  <td class="py-4 px-6 text-sm text-slate-500">{{ emp.positionName }}</td>
                  <td class="py-4 px-6 text-center">
                    @if (emp.status === 'Đang hoạt động') {
                      <span class="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200">Active</span>
                    } @else if (emp.status === 'Nghỉ phép') {
                      <span class="inline-flex items-center px-2 py-1 rounded bg-amber-50 text-amber-600 text-xs font-medium border border-amber-200">On Leave</span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-1 rounded bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200">Inactive</span>
                    }
                  </td>
                  <td class="py-4 px-6 text-right">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                      @if (isAdminOrHR()) {
                        <button (click)="openEditModal(emp.employeeId)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Sửa">✏️</button>
                        <button (click)="deleteEmployee(emp.employeeId)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" title="Xóa">🗑️</button>
                      } @else {
                        <span class="text-xs text-slate-400 italic">Chỉ xem</span>
                      }
                    </div>
                  </td>
                </tr>
              }
              @if (employees().length === 0) {
                <tr><td colspan="7" class="py-8 text-center text-slate-500">Không tìm thấy nhân viên nào.</td></tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/30">
          <div class="text-sm text-slate-500">
            Hiển thị <span class="font-medium text-slate-700">{{ employees().length }}</span> / <span class="font-medium text-slate-700">{{ totalCount() }}</span> nhân viên (Trang {{ pageNumber() }}/{{ totalPages() || 1 }})
          </div>
          <div class="flex gap-1 items-center">
            <button (click)="changePage(pageNumber() - 1)" [disabled]="pageNumber() === 1"
              class="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Trước
            </button>
            @for (p of pagesArray(); track p) {
              <button (click)="changePage(p)"
                class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                [class]="p === pageNumber() ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'">
                {{ p }}
              </button>
            }
            <button (click)="changePage(pageNumber() + 1)" [disabled]="pageNumber() === totalPages() || totalPages() === 0"
              class="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Sau
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Modal Form (Create/Edit) - Simplified for brevity -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-xl font-bold text-slate-800">{{ isEditMode() ? 'Chỉnh sửa nhân viên' : 'Thêm nhân sự mới' }}</h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✖</button>
          </div>
          <div class="p-6 overflow-y-auto">
            <form [formGroup]="employeeForm" (ngSubmit)="submitForm()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Mã NV</label>
                  <input type="text" formControlName="employeeId" readonly class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 opacity-60">
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Họ và tên <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="fullName" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Email</label>
                  <input type="email" formControlName="email" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Số điện thoại</label>
                  <input type="text" formControlName="phoneNumber" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Phòng ban <span class="text-rose-500">*</span></label>
                  <select formControlName="departmentId" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <option value="" disabled>Chọn phòng ban</option>
                    @for (dept of departments(); track dept.departmentId) {
                      <option [value]="dept.departmentId">{{ dept.departmentName }}</option>
                    }
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Chức vụ <span class="text-rose-500">*</span></label>
                  <select formControlName="positionId" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <option value="" disabled>Chọn chức vụ</option>
                    @for (pos of positions(); track pos.positionId) {
                      <option [value]="pos.positionId">{{ pos.positionName }}</option>
                    }
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Ngày vào làm <span class="text-rose-500">*</span></label>
                  <input type="date" formControlName="hireDate" [max]="todayDateStr" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Trạng thái <span class="text-rose-500">*</span></label>
                  <select formControlName="status" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Nghỉ phép">Nghỉ phép</option>
                    <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                  </select>
                </div>
              </div>
              @if (formError()) {
                <div class="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-200">⚠️ {{ formError() }}</div>
              }
              <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" [disabled]="employeeForm.invalid || isSaving()" class="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class EmployeeListComponent implements OnInit {
  private employeeState = inject(EmployeeStateService);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private positionService = inject(PositionService);
  private authService = inject(AuthService);

  employees = this.employeeState.employees;
  isLoading = this.employeeState.isLoading;
  uniqueDepartments = this.employeeState.uniqueDepartments;
  pageNumber = this.employeeState.pageNumber;
  totalPages = this.employeeState.totalPages;
  totalCount = this.employeeState.totalCount;
  searchTerm = this.employeeState.searchTerm;
  departmentId = this.employeeState.departmentId;

  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  departments = signal<Department[]>([]);
  positions = signal<Position[]>([]);

  isModalOpen = signal(false);
  isEditMode = signal(false);
  isSaving = signal(false);
  formError = signal('');
  todayDateStr = new Date().toISOString().split('T')[0];

  isAdminOrHR = computed(() => this.authService.hasRole('Admin') || this.authService.hasRole('HR'));

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

  ngOnInit() {
    this.employeeState.loadEmployees();
    this.departmentService.getAll().subscribe(data => this.departments.set(data));
    this.positionService.getAll().subscribe(data => this.positions.set(data));
  }

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

  openCreateModal() {
    this.isEditMode.set(false);
    this.formError.set('');
    this.employeeForm.reset({ status: 'Đang hoạt động' });
    this.isModalOpen.set(true);
  }

  openEditModal(id: string) {
    this.isEditMode.set(true);
    this.formError.set('');
    this.isModalOpen.set(true);
    this.employeeService.getById(id).subscribe({
      next: (emp) => {
        const dateObj = new Date(emp.hireDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        
        this.employeeForm.patchValue({
          ...emp,
          hireDate: `${yyyy}-${mm}-${dd}`
        });
      },
      error: () => this.formError.set('Không thể tải thông tin nhân viên.')
    });
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.employeeForm.reset();
  }

  submitForm() {
    if (this.employeeForm.invalid) return;
    this.isSaving.set(true);
    const data = this.employeeForm.getRawValue() as any;
    
    // Convert empty strings to null for backend validation
    if (!data.email) data.email = null;
    if (!data.phoneNumber) data.phoneNumber = null;
    if (!data.employeeId) data.employeeId = null;

    const handleError = (err: any) => {
      let msg = err.error?.message || 'Lỗi hệ thống';
      if (err.error?.errors) {
        const firstKey = Object.keys(err.error.errors)[0];
        msg = err.error.errors[firstKey][0];
      }
      this.formError.set(msg);
      this.isSaving.set(false);
    };

    if (this.isEditMode()) {
      this.employeeService.update(data.employeeId, data).subscribe({
        next: () => { this.closeModal(); this.employeeState.loadEmployees(); this.isSaving.set(false); },
        error: handleError
      });
    } else {
      this.employeeService.create(data).subscribe({
        next: () => { this.closeModal(); this.employeeState.loadEmployees(); this.isSaving.set(false); },
        error: handleError
      });
    }
  }

  deleteEmployee(id: string) {
    if (confirm(`Chắc chắn muốn xóa nhân viên ${id}?`)) {
      this.employeeService.delete(id).subscribe({
        next: () => this.employeeState.loadEmployees(),
        error: () => alert('Lỗi khi xóa.')
      });
    }
  }
}
