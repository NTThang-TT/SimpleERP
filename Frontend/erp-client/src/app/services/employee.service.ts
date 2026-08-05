import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { EmployeeDTO, EmployeeInput, Employee, PagedResult, EmployeeStatisticsDTO } from '../models/employee-dto.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:5000/api/employee';
  private http = inject(HttpClient);

  getAll(page: number = 1, pageSize: number = 10, search?: string, departmentId?: string): Observable<PagedResult<EmployeeDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
      
    if (search) params = params.set('search', search);
    if (departmentId && departmentId !== 'all') params = params.set('departmentId', departmentId);

    return this.http.get<PagedResult<EmployeeDTO>>(this.apiUrl, { params });
  }

  getStatistics(): Observable<EmployeeStatisticsDTO> {
    return this.http.get<EmployeeStatisticsDTO>(`${this.apiUrl}/statistics`);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: EmployeeInput): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: string, employee: EmployeeInput): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
