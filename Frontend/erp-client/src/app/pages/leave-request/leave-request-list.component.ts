import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaveRequestService, LeaveRequestDTO, LeaveRequestInputDTO } from '../../services/leave-request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden m-6">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">📋 {{ isAdminOrHR() ? 'Đơn Xin Nghỉ Phép' : 'Đơn Nghỉ Phép Của Tôi' }}</h2>
          <p class="text-sm text-slate-500 mt-1">{{ isAdminOrHR() ? 'Quản lý đơn xin nghỉ phép của nhân viên' : 'Xem và tạo đơn xin nghỉ phép' }}</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          @if (isAdminOrHR()) {
            <!-- Search -->
            <input type="text" placeholder="🔍 Tìm theo tên NV..."
              class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 w-48"
              (input)="onSearch($event)">
            <!-- Filter Status -->
            <select class="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              (change)="onStatusChange($event)">
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Từ chối">Từ chối</option>
            </select>
            <!-- Filter Leave Type -->
            <select class="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              (change)="onTypeChange($event)">
              <option value="all">Tất cả loại nghỉ</option>
              <option value="Nghỉ phép năm">Nghỉ phép năm</option>
              <option value="Nghỉ ốm">Nghỉ ốm</option>
              <option value="Nghỉ không lương">Nghỉ không lương</option>
              <option value="Nghỉ việc riêng">Nghỉ việc riêng</option>
            </select>
          }
          <button (click)="openCreateModal()"
            class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
            + Tạo đơn nghỉ phép
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50/80 text-left">
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhân viên</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại nghỉ</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Từ ngày</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Đến ngày</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lý do</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người duyệt</th>
              <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @if (isLoading()) {
              <tr><td colspan="8" class="text-center py-12 text-slate-400">⏳ Đang tải...</td></tr>
            } @else if (items().length === 0) {
              <tr><td colspan="8" class="text-center py-12 text-slate-400">Không có đơn nghỉ phép</td></tr>
            } @else {
              @for (item of items(); track item.leaveRequestId) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-medium text-slate-800 text-sm">{{ item.employeeFullName }}</div>
                    <div class="text-xs text-slate-400">{{ item.departmentName }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      [class]="getTypeClass(item.leaveType)">
                      {{ item.leaveType }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ item.startDate | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ item.endDate | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate" [title]="item.reason">{{ item.reason }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      [class]="getStatusClass(item.status)">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ item.approvedBy || '—' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      @if (isAdminOrHR() && item.status === 'Chờ duyệt') {
                        <button (click)="approveRequest(item.leaveRequestId, 'Đã duyệt')"
                          class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-all">
                          ✅ Duyệt
                        </button>
                        <button (click)="approveRequest(item.leaveRequestId, 'Từ chối')"
                          class="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all">
                          ❌ Từ chối
                        </button>
                      }
                      @if (item.status === 'Chờ duyệt') {
                        <button (click)="deleteRequest(item.leaveRequestId)"
                          class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">Xóa</button>
                      }
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div class="text-sm text-slate-500">
          Hiển thị {{ items().length }} / {{ totalCount() }} đơn
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

    <!-- Modal Tạo Đơn Nghỉ Phép -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-4">📝 Tạo Đơn Xin Nghỉ Phép</h3>
          @if (formError()) {
            <div class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{{ formError() }}</div>
          }
          <form [formGroup]="leaveForm" (ngSubmit)="submitForm()">
            <div class="space-y-4">
              <div class="hidden">
                <input formControlName="employeeId" type="hidden">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Loại nghỉ</label>
                <select formControlName="leaveType"
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                  <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                  <option value="Nghỉ ốm">Nghỉ ốm</option>
                  <option value="Nghỉ không lương">Nghỉ không lương</option>
                  <option value="Nghỉ việc riêng">Nghỉ việc riêng</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
                  <input formControlName="startDate" type="date"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
                  <input formControlName="endDate" type="date"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Lý do</label>
                <textarea formControlName="reason" rows="3" placeholder="Nhập lý do xin nghỉ..."
                  class="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                  [class]="leaveForm.get('reason')?.invalid && leaveForm.get('reason')?.touched ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-400'"></textarea>
                @if (leaveForm.get('reason')?.invalid && leaveForm.get('reason')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Vui lòng nhập lý do.</p>
                }
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" (click)="closeModal()" class="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">Hủy</button>
              <button type="submit" [disabled]="isSaving()" class="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                {{ isSaving() ? 'Đang gửi...' : 'Gửi đơn' }}
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
export class LeaveRequestListComponent implements OnInit {
  private leaveService = inject(LeaveRequestService);
  private authService = inject(AuthService);

  items = signal<LeaveRequestDTO[]>([]);
  isLoading = signal(false);
  totalCount = signal(0);
  currentPage = signal(1);
  totalPages = signal(0);
  pageSize = 10;

  searchTerm = '';
  filterStatus = '';
  filterType = '';

  isModalOpen = signal(false);
  isSaving = signal(false);
  formError = signal('');

  leaveForm = new FormGroup({
    employeeId: new FormControl(''),
    leaveType: new FormControl('Nghỉ phép năm', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required])
  });

  isAdminOrHR = computed(() => this.authService.hasRole('Admin') || this.authService.hasRole('HR'));

  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // Get current user's employee ID from JWT using AuthService
  get currentEmployeeId(): string {
    return this.authService.getEmployeeId() || '';
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    // Employee chỉ xem đơn nghỉ phép của chính mình
    if (this.authService.isEmployee()) {
      this.leaveService.getMyRequests({
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
    } else {
      // Admin/HR xem tất cả
      this.leaveService.getAll({
        search: this.searchTerm || undefined,
        status: this.filterStatus || undefined,
        leaveType: this.filterType || undefined,
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
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  onStatusChange(event: Event) {
    this.filterStatus = (event.target as HTMLSelectElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  onTypeChange(event: Event) {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.currentPage.set(1);
    this.loadData();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadData();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Chờ duyệt': return 'bg-amber-50 text-amber-700';
      case 'Đã duyệt': return 'bg-emerald-50 text-emerald-700';
      case 'Từ chối': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Nghỉ phép năm': return 'bg-blue-50 text-blue-700';
      case 'Nghỉ ốm': return 'bg-orange-50 text-orange-700';
      case 'Nghỉ không lương': return 'bg-slate-100 text-slate-700';
      case 'Nghỉ việc riêng': return 'bg-purple-50 text-purple-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  openCreateModal() {
    this.formError.set('');
    this.leaveForm.reset({ leaveType: 'Nghỉ phép năm' });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submitForm() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.formError.set('');

    const f = this.leaveForm.value;
    const dto: LeaveRequestInputDTO = {
      employeeId: this.currentEmployeeId,
      leaveType: f.leaveType!,
      startDate: f.startDate!,
      endDate: f.endDate!,
      reason: f.reason!
    };

    this.leaveService.create(dto).subscribe({
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

  approveRequest(id: number, status: string) {
    const action = status === 'Đã duyệt' ? 'duyệt' : 'từ chối';
    if (confirm(`Bạn có chắc muốn ${action} đơn nghỉ phép này?`)) {
      this.leaveService.approve(id, {
        status,
        approvedBy: this.currentEmployeeId
      }).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Đã xảy ra lỗi.')
      });
    }
  }

  deleteRequest(id: number) {
    if (confirm('Bạn có chắc muốn xóa đơn nghỉ phép này?')) {
      this.leaveService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Lỗi khi xóa.')
      });
    }
  }
}
