import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AttendanceService, AttendanceDTO, AttendanceInputDTO } from '../../services/attendance.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/employee-dto.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden m-6">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">🕐 Bảng Chấm Công</h2>
          <p class="text-sm text-slate-500 mt-1">Quản lý chấm công hàng ngày của nhân viên</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Search -->
          <input type="text" placeholder="🔍 Tìm theo tên NV..."
            class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 w-48"
            (input)="onSearch($event)">
          <!-- Filter Date -->
          <input type="date"
            class="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            (change)="onDateChange($event)">
          <!-- Filter Department -->
          <select class="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            (change)="onDeptChange($event)">
            <option value="all">Tất cả phòng ban</option>
            @for (d of departments(); track d.departmentId) {
              <option [value]="d.departmentId">{{ d.departmentName }}</option>
            }
          </select>
          <!-- Filter Status -->
          <select class="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            (change)="onStatusChange($event)">
            <option value="all">Tất cả trạng thái</option>
            <option value="Đúng giờ">Đúng giờ</option>
            <option value="Đi trễ">Đi trễ</option>
            <option value="Vắng mặt">Vắng mặt</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
          </select>
          @if (isAdminOrHR()) {
            <button (click)="openCreateModal()"
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
              + Thêm chấm công
            </button>
          }
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50/80 text-left">
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhân viên</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phòng ban</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giờ vào</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giờ ra</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ghi chú</th>
              @if (isAdminOrHR()) {
                <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @if (isLoading()) {
              <tr><td colspan="8" class="text-center py-12 text-slate-400">⏳ Đang tải...</td></tr>
            } @else if (items().length === 0) {
              <tr><td colspan="8" class="text-center py-12 text-slate-400">Không có dữ liệu chấm công</td></tr>
            } @else {
              @for (item of items(); track item.attendanceId) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-medium text-slate-800 text-sm">{{ item.employeeFullName }}</div>
                    <div class="text-xs text-slate-400">{{ item.employeeId }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ item.departmentName }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ item.date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ item.checkIn ? (item.checkIn | date:'HH:mm') : '—' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ item.checkOut ? (item.checkOut | date:'HH:mm') : '—' }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      [class]="getStatusClass(item.status)">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{{ item.note || '—' }}</td>
                  @if (isAdminOrHR()) {
                    <td class="px-6 py-4">
                      <button (click)="deleteAttendance(item.attendanceId)" class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Xóa</button>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div class="text-sm text-slate-500">
          Hiển thị {{ items().length }} / {{ totalCount() }} bản ghi
        </div>
        <div class="flex gap-1">
          @for (p of pagesArray(); track p) {
            <button (click)="goToPage(p)"
              class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
              [class]="p === currentPage() ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'">
              {{ p }}
            </button>
          }
        </div>
      </div>
    </div>

    <!-- Modal Thêm Chấm Công -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-4">➕ Thêm Chấm Công</h3>
          @if (formError()) {
            <div class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{{ formError() }}</div>
          }
          <form [formGroup]="attendanceForm" (ngSubmit)="submitForm()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Mã nhân viên</label>
                <input formControlName="employeeId" type="text" placeholder="VD: NV_04_M"
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Ngày</label>
                <input formControlName="date" type="date"
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Giờ vào</label>
                  <input formControlName="checkIn" type="time"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Giờ ra</label>
                  <input formControlName="checkOut" type="time"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select formControlName="status"
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                  <option value="Đúng giờ">Đúng giờ</option>
                  <option value="Đi trễ">Đi trễ</option>
                  <option value="Vắng mặt">Vắng mặt</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <input formControlName="note" type="text" placeholder="Tùy chọn..."
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" (click)="closeModal()" class="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">Hủy</button>
              <button type="submit" [disabled]="isSaving()" class="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                {{ isSaving() ? 'Đang lưu...' : 'Lưu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AttendanceListComponent implements OnInit {
  private attendanceService = inject(AttendanceService);
  private departmentService = inject(DepartmentService);
  private authService = inject(AuthService);

  // Data
  items = signal<AttendanceDTO[]>([]);
  departments = signal<Department[]>([]);
  isLoading = signal(false);
  totalCount = signal(0);
  currentPage = signal(1);
  totalPages = signal(0);
  pageSize = 10;

  // Filters
  searchTerm = '';
  filterDept = '';
  filterStatus = '';
  filterDate = '';

  // Modal
  isModalOpen = signal(false);
  isSaving = signal(false);
  formError = signal('');

  attendanceForm = new FormGroup({
    employeeId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    checkIn: new FormControl(''),
    checkOut: new FormControl(''),
    status: new FormControl('Đúng giờ', [Validators.required]),
    note: new FormControl('')
  });

  isAdminOrHR = computed(() => this.authService.hasRole('Admin') || this.authService.hasRole('HR'));

  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  ngOnInit() {
    this.loadData();
    this.departmentService.getAll().subscribe(d => this.departments.set(d));
  }

  loadData() {
    this.isLoading.set(true);
    this.attendanceService.getAll({
      search: this.searchTerm || undefined,
      departmentId: this.filterDept || undefined,
      status: this.filterStatus || undefined,
      date: this.filterDate || undefined,
      page: this.currentPage(),
      pageSize: this.pageSize
    }).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  onDateChange(event: Event) {
    this.filterDate = (event.target as HTMLInputElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  onDeptChange(event: Event) {
    this.filterDept = (event.target as HTMLSelectElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  onStatusChange(event: Event) {
    this.filterStatus = (event.target as HTMLSelectElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadData();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đúng giờ': return 'bg-emerald-50 text-emerald-700';
      case 'Đi trễ': return 'bg-amber-50 text-amber-700';
      case 'Vắng mặt': return 'bg-red-50 text-red-700';
      case 'Nghỉ phép': return 'bg-blue-50 text-blue-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  openCreateModal() {
    this.formError.set('');
    this.attendanceForm.reset({ status: 'Đúng giờ' });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submitForm() {
    if (this.attendanceForm.invalid) {
      this.attendanceForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.formError.set('');

    const f = this.attendanceForm.value;
    const dateStr = f.date!;

    const dto: AttendanceInputDTO = {
      employeeId: f.employeeId!,
      date: dateStr,
      checkIn: f.checkIn ? `${dateStr}T${f.checkIn}:00` : null,
      checkOut: f.checkOut ? `${dateStr}T${f.checkOut}:00` : null,
      status: f.status!,
      note: f.note || null
    };

    this.attendanceService.create(dto).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.formError.set(err.error?.message || 'Đã xảy ra lỗi.');
      }
    });
  }

  deleteAttendance(id: number) {
    if (confirm('Bạn có chắc muốn xóa bản ghi chấm công này?')) {
      this.attendanceService.delete(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Lỗi khi xóa.')
      });
    }
  }
}
