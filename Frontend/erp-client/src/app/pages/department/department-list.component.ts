import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { Department } from '../../models/employee-dto.model';
import { SearchBarComponent } from '../../shared/search-bar/search-bar';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchBarComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden m-6">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 class="text-xl font-bold text-slate-800">Quản lý Phòng ban</h3>
          <p class="text-sm text-slate-500 mt-1">Danh sách phòng ban và các bộ phận trực thuộc.</p>
        </div>
        <div class="flex items-center gap-3">
          <app-search-bar placeholder="Tìm kiếm phòng ban..." (searchQuery)="onSearch($event)"></app-search-bar>
          @if (isAdminOrHR()) {
            <button (click)="openCreateModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-md flex items-center gap-2">
              <span>➕</span> Thêm mới
            </button>
          }
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Mã PB</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Tên Phòng ban</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Vị trí (Location)</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (dept of filteredDepartments(); track dept.departmentId) {
              <tr class="hover:bg-slate-50 transition-colors group">
                <td class="py-4 px-6 font-mono text-sm text-slate-600">{{ dept.departmentId }}</td>
                <td class="py-4 px-6 font-semibold text-slate-800">{{ dept.departmentName }}</td>
                <td class="py-4 px-6 text-sm text-slate-500">{{ dept.location || 'Chưa cập nhật' }}</td>
                <td class="py-4 px-6 text-right">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                    @if (isAdminOrHR()) {
                      <button (click)="openEditModal(dept)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Sửa">✏️</button>
                      <button (click)="deleteDept(dept.departmentId)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" title="Xóa">🗑️</button>
                    } @else {
                      <span class="text-xs text-slate-400 italic">Chỉ xem</span>
                    }
                  </div>
                </td>
              </tr>
            }
            @if (filteredDepartments().length === 0) {
              <tr>
                <td colspan="4" class="py-8 text-center text-slate-500">Không tìm thấy phòng ban nào.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-xl font-bold text-slate-800">{{ isEditMode() ? 'Sửa Phòng ban' : 'Thêm Phòng ban' }}</h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✖</button>
          </div>
          <div class="p-6">
            <form [formGroup]="form" (ngSubmit)="submitForm()" class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Mã Phòng ban <span class="text-rose-500">*</span></label>
                <input type="text" formControlName="departmentId" [readonly]="isEditMode()"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20"
                  [ngClass]="isEditMode() ? 'opacity-60 cursor-not-allowed' : ''">
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Tên Phòng ban <span class="text-rose-500">*</span></label>
                <input type="text" formControlName="departmentName"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Vị trí (Location)</label>
                <input type="text" formControlName="location"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
              </div>

              @if (formError()) {
                <div class="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-200">
                  ⚠️ {{ formError() }}
                </div>
              }

              <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" [disabled]="form.invalid || isSaving()"
                  class="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl flex items-center gap-2">
                  {{ isSaving() ? 'Đang lưu...' : 'Lưu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class DepartmentListComponent implements OnInit {
  private deptService = inject(DepartmentService);
  private authService = inject(AuthService);

  departments = signal<Department[]>([]);
  searchTerm = signal('');
  
  filteredDepartments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.departments().filter(d => 
      d.departmentName.toLowerCase().includes(term) || 
      d.departmentId.toLowerCase().includes(term)
    );
  });

  isAdminOrHR = computed(() => {
    return this.authService.hasRole('Admin') || this.authService.hasRole('HR');
  });

  isModalOpen = signal(false);
  isEditMode = signal(false);
  isSaving = signal(false);
  formError = signal('');

  form = new FormGroup({
    departmentId: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    departmentName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    location: new FormControl('', [Validators.maxLength(100)])
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.deptService.getAll().subscribe(data => this.departments.set(data));
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  openCreateModal() {
    this.isEditMode.set(false);
    this.formError.set('');
    this.form.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(dept: Department) {
    this.isEditMode.set(true);
    this.formError.set('');
    this.form.patchValue(dept);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.form.reset();
  }

  submitForm() {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    this.formError.set('');

    const data = this.form.getRawValue();

    if (this.isEditMode()) {
      this.deptService.update(data.departmentId as string, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData();
          alert('Cập nhật phòng ban thành công!');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.formError.set(err.error?.message || 'Lỗi khi cập nhật');
        }
      });
    } else {
      this.deptService.create(data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData();
          alert('Thêm phòng ban thành công!');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.formError.set(err.error?.message || 'Lỗi khi thêm mới');
        }
      });
    }
  }

  deleteDept(id: string) {
    if (confirm(`Bạn có chắc muốn xóa phòng ban ${id}?`)) {
      this.deptService.delete(id).subscribe({
        next: () => {
          this.loadData();
          alert('Xóa phòng ban thành công!');
        },
        error: (err) => alert(err.error?.message || 'Lỗi khi xóa')
      });
    }
  }
}
