import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset, AssetInput, PagedResult } from '../models/employee-dto.model';

export interface AssetFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AssetService {
  private apiUrl = 'http://localhost:5000/api/asset';
  private http = inject(HttpClient);

  getAll(params?: AssetFilterParams): Observable<PagedResult<Asset>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.departmentId && params.departmentId !== 'all') {
      httpParams = httpParams.set('departmentId', params.departmentId);
    }
    if (params?.status && params.status !== 'all') {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<PagedResult<Asset>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/${id}`);
  }

  create(data: AssetInput): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, data);
  }

  update(id: string, data: AssetInput): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
