import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveRequestDTO {
  leaveRequestId: number;
  employeeId: string;
  employeeFullName: string;
  departmentName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvedBy: string | null;
  createdAt: string;
}

export interface LeaveRequestInputDTO {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveApprovalDTO {
  status: string;
  approvedBy: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class LeaveRequestService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/leaverequest';

  getAll(params: {
    search?: string;
    status?: string;
    leaveType?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<LeaveRequestDTO>> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.leaveType) httpParams = httpParams.set('leaveType', params.leaveType);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());

    return this.http.get<PagedResult<LeaveRequestDTO>>(this.baseUrl, { params: httpParams });
  }

  getMyRequests(params: { page?: number; pageSize?: number }): Observable<PagedResult<LeaveRequestDTO>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    return this.http.get<PagedResult<LeaveRequestDTO>>(`${this.baseUrl}/my-requests`, { params: httpParams });
  }

  getById(id: number): Observable<LeaveRequestDTO> {
    return this.http.get<LeaveRequestDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: LeaveRequestInputDTO): Observable<LeaveRequestDTO> {
    return this.http.post<LeaveRequestDTO>(this.baseUrl, dto);
  }

  approve(id: number, dto: LeaveApprovalDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/approve`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
