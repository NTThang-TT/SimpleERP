import { Injectable, inject, signal, computed } from '@angular/core';
import { EmployeeDTO, EmployeeStatisticsDTO } from '../models/employee-dto.model';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStateService {
  private employeeService = inject(EmployeeService);

  // STATE (Tín hiệu trạng thái)
  private _employees = signal<EmployeeDTO[]>([]);
  private _isLoading = signal<boolean>(false);
  private _errorMessage = signal<string>('');
  
  // Pagination State
  private _pageNumber = signal<number>(1);
  private _pageSize = signal<number>(10);
  private _totalCount = signal<number>(0);
  private _totalPages = signal<number>(0);

  // Filter State
  private _searchTerm = signal<string>('');
  private _departmentId = signal<string>('all');

  // Statistics State
  private _statistics = signal<EmployeeStatisticsDTO | null>(null);

  // SELECTORS (Tín hiệu chỉ đọc & Tính toán)
  public readonly employees = this._employees.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();
  
  public readonly pageNumber = this._pageNumber.asReadonly();
  public readonly pageSize = this._pageSize.asReadonly();
  public readonly totalCount = this._totalCount.asReadonly();
  public readonly totalPages = this._totalPages.asReadonly();
  public readonly searchTerm = this._searchTerm.asReadonly();
  public readonly departmentId = this._departmentId.asReadonly();

  // Thống kê lấy từ API
  public readonly activeCount = computed(() => {
    const stats = this._statistics();
    if (!stats) return 0;
    return stats.departments.reduce((acc, curr) => acc + curr.activeEmployees, 0);
  });
  
  public readonly onLeaveCount = computed(() => {
    const stats = this._statistics();
    if (!stats) return 0;
    return stats.departments.reduce((acc, curr) => acc + curr.onLeaveEmployees, 0);
  });
  
  public readonly inactiveCount = computed(() => {
    const stats = this._statistics();
    if (!stats) return 0;
    return stats.departments.reduce((acc, curr) => acc + (curr.totalEmployees - curr.activeEmployees - curr.onLeaveEmployees), 0);
  });

  public readonly uniqueDepartments = computed(() => {
    const stats = this._statistics();
    if (!stats) return [];
    return stats.departments.map(d => d.departmentName).sort();
  });


  // ACTIONS (Hành động cập nhật trạng thái)

  public loadEmployees(): void {
    this._isLoading.set(true);
    this._errorMessage.set('');

    this.employeeService.getAll(
      this._pageNumber(),
      this._pageSize(),
      this._searchTerm(),
      this._departmentId()
    ).subscribe({
      next: (data) => {
        this._employees.set(data.items);
        this._totalCount.set(data.totalCount);
        this._totalPages.set(data.totalPages);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this._errorMessage.set('Lỗi kết nối tới Server.');
        this._isLoading.set(false);
      }
    });

    // Cũng load lại thống kê
    this.employeeService.getStatistics().subscribe({
      next: (stats) => this._statistics.set(stats),
      error: (err) => console.error('Stats API Error:', err)
    });
  }

  public updateFilters(search: string, deptId: string) {
    this._searchTerm.set(search);
    this._departmentId.set(deptId);
    this._pageNumber.set(1); // Reset về trang 1 khi filter
    this.loadEmployees();
  }

  public changePage(page: number) {
    if (page >= 1 && page <= this._totalPages()) {
      this._pageNumber.set(page);
      this.loadEmployees();
    }
  }

  // Reload data after an action
  public refreshData(): void {
    this.loadEmployees();
  }
}
