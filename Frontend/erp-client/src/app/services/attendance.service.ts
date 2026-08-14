import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceDTO {
  attendanceId: number;
  employeeId: string;
  employeeFullName: string;
  departmentName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  note: string | null;
}

export interface AttendanceInputDTO {
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  note: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/attendance';

  getAll(params: {
    search?: string;
    departmentId?: string;
    status?: string;
    date?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<AttendanceDTO>> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.departmentId) httpParams = httpParams.set('departmentId', params.departmentId);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.date) httpParams = httpParams.set('date', params.date);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());

    return this.http.get<PagedResult<AttendanceDTO>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<AttendanceDTO> {
    return this.http.get<AttendanceDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: AttendanceInputDTO): Observable<AttendanceDTO> {
    return this.http.post<AttendanceDTO>(this.baseUrl, dto);
  }

  update(id: number, dto: AttendanceInputDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // --- Chấm công cá nhân ---

  getMyToday(): Observable<AttendanceDTO> {
    return this.http.get<AttendanceDTO>(`${this.baseUrl}/my-today`);
  }

  checkIn(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/check-in`, {});
  }

  checkOut(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/check-out`, {});
  }
}
