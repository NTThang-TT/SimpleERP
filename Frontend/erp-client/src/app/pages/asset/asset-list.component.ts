import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';
import { Asset, Department, AssetInput } from '../../models/employee-dto.model';
import { SearchBarComponent } from '../../shared/search-bar/search-bar';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchBarComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden m-6">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
        <div>
          <h3 class="text-xl font-bold text-slate-800">Quản lý Vật tư & Thiết bị</h3>
          <p class="text-sm text-slate-500 mt-1">Quản lý tài sản công ty và phân bổ cho các phòng ban.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter by Department -->
          <select class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
            (change)="onFilterDepartment($event)">
            <option value="all">Tất cả phòng ban</option>
            @for (dept of departments(); track dept.departmentId) {
              <option [value]="dept.departmentId">{{ dept.departmentName }}</option>
            }
          </select>

          <app-search-bar placeholder="Tìm kiếm vật tư..." (searchQuery)="onSearch($event)"></app-search-bar>
          
          @if (isAdminOrHR()) {
            <button (click)="openCreateModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-md flex items-center gap-2">
              <span>➕</span> Thêm vật tư
            </button>
          }
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Mã VT</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Tên vật tư</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Danh mục</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Phòng ban</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-center">SL</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-center">Trạng thái</th>
              <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (asset of filteredAssets(); track asset.assetId) {
              <tr class="hover:bg-slate-50 transition-colors group">
                <td class="py-4 px-6 font-mono text-sm text-slate-600">{{ asset.assetId }}</td>
                <td class="py-4 px-6">
                  <div class="font-semibold text-slate-800">{{ asset.assetName }}</div>
                  <div class="text-xs text-slate-500">{{ asset.unitPrice | number:'1.0-0' }} VNĐ / {{ asset.unit }}</div>
                </td>
                <td class="py-4 px-6 text-sm text-slate-600">{{ asset.category }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                    {{ asset.departmentName }}
                  </span>
                </td>
                <td class="py-4 px-6 text-center font-medium text-slate-800">{{ asset.quantity }}</td>
                <td class="py-4 px-6 text-center">
                  @if (asset.status === 'Đang sử dụng') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200">
                      Active
                    </span>
                  } @else {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium border border-amber-200">
                      {{ asset.status }}
                    </span>
                  }
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                    @if (isAdminOrHR()) {
                      <button (click)="openEditModal(asset)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Sửa">✏️</button>
                      <button (click)="deleteAsset(asset.assetId)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" title="Xóa">🗑️</button>
                    } @else {
                      <span class="text-xs text-slate-400 italic">Chỉ xem</span>
                    }
                  </div>
                </td>
              </tr>
            }
            @if (filteredAssets().length === 0) {
              <tr>
                <td colspan="7" class="py-8 text-center text-slate-500">Không tìm thấy vật tư nào.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-xl font-bold text-slate-800">{{ isEditMode() ? 'Cập nhật Vật tư' : 'Thêm mới Vật tư' }}</h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✖</button>
          </div>
          <div class="p-6">
            <form [formGroup]="form" (ngSubmit)="submitForm()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Mã Vật tư <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="assetId" [readonly]="isEditMode()"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20"
                    [ngClass]="isEditMode() ? 'opacity-60 cursor-not-allowed' : ''">
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Tên Vật tư <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="assetName"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Danh mục <span class="text-rose-500">*</span></label>
                  <select formControlName="category"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="Thiết bị CNTT">Thiết bị CNTT</option>
                    <option value="Nội thất">Nội thất</option>
                    <option value="Máy móc">Máy móc</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">Số lượng <span class="text-rose-500">*</span></label>
                    <input type="number" formControlName="quantity"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">Đơn vị <span class="text-rose-500">*</span></label>
                    <input type="text" formControlName="unit"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Đơn giá (VNĐ) <span class="text-rose-500">*</span></label>
                  <input type="number" formControlName="unitPrice"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Phòng ban cấp <span class="text-rose-500">*</span></label>
                  <select formControlName="departmentId"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Chọn phòng ban...</option>
                    @for (dept of departments(); track dept.departmentId) {
                      <option [value]="dept.departmentId">{{ dept.departmentName }}</option>
                    }
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Ngày mua <span class="text-rose-500">*</span></label>
                  <input type="date" formControlName="purchaseDate"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Trạng thái <span class="text-rose-500">*</span></label>
                  <select formControlName="status"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="Đang sử dụng">Đang sử dụng</option>
                    <option value="Trong kho">Trong kho</option>
                    <option value="Đang sửa chữa">Đang sửa chữa</option>
                    <option value="Thanh lý">Thanh lý</option>
                  </select>
                </div>

              </div>
              
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Ghi chú thêm</label>
                <textarea formControlName="description" rows="2"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20"></textarea>
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
                  {{ isSaving() ? 'Đang lưu...' : 'Lưu dữ liệu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class AssetListComponent implements OnInit {
  private assetService = inject(AssetService);
  private deptService = inject(DepartmentService);
  private authService = inject(AuthService);

  assets = signal<Asset[]>([]);
  departments = signal<Department[]>([]);
  
  searchTerm = signal('');
  filterDepartmentId = signal('all');

  filteredAssets = computed(() => {
    let list = this.assets();
    const term = this.searchTerm().toLowerCase();

    if (term) {
      list = list.filter(a => 
        a.assetName.toLowerCase().includes(term) || 
        a.assetId.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term)
      );
    }
    return list;
  });

  isAdminOrHR = computed(() => {
    return this.authService.hasRole('Admin') || this.authService.hasRole('HR');
  });

  isModalOpen = signal(false);
  isEditMode = signal(false);
  isSaving = signal(false);
  formError = signal('');

  form = new FormGroup({
    assetId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    assetName: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    category: new FormControl('Thiết bị CNTT', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    unit: new FormControl('cái', [Validators.required]),
    unitPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    departmentId: new FormControl('', [Validators.required]),
    status: new FormControl('Đang sử dụng', [Validators.required]),
    purchaseDate: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  ngOnInit() {
    this.loadLookups();
    this.loadData();
  }

  loadLookups() {
    this.deptService.getAll().subscribe(data => this.departments.set(data));
  }

  loadData() {
    this.assetService.getAll(this.filterDepartmentId()).subscribe(data => this.assets.set(data));
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  onFilterDepartment(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterDepartmentId.set(select.value);
    this.loadData(); // Reload API based on department
  }

  openCreateModal() {
    this.isEditMode.set(false);
    this.formError.set('');
    this.form.reset({
      category: 'Thiết bị CNTT',
      quantity: 1,
      unit: 'cái',
      unitPrice: 0,
      status: 'Đang sử dụng',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    this.isModalOpen.set(true);
  }

  openEditModal(asset: Asset) {
    this.isEditMode.set(true);
    this.formError.set('');
    
    // Format date for input type=date
    let formattedDate = asset.purchaseDate;
    if (formattedDate && formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0];
    }

    this.form.patchValue({
      ...asset,
      purchaseDate: formattedDate
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.form.reset();
  }

  submitForm() {
    if (this.form.invalid) {
      this.formError.set('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    this.isSaving.set(true);
    this.formError.set('');

    const data = this.form.getRawValue() as AssetInput;

    if (this.isEditMode()) {
      this.assetService.update(data.assetId, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.formError.set(err.error?.message || 'Lỗi khi cập nhật');
        }
      });
    } else {
      this.assetService.create(data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.formError.set(err.error?.message || 'Lỗi khi thêm mới');
        }
      });
    }
  }

  deleteAsset(id: string) {
    if (confirm(`Bạn có chắc muốn xóa vật tư ${id}?`)) {
      this.assetService.delete(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Lỗi khi xóa')
      });
    }
  }
}
