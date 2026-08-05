import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset, AssetInput } from '../models/employee-dto.model';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private apiUrl = 'http://localhost:5000/api/asset';
  private http = inject(HttpClient);

  getAll(departmentId?: string): Observable<Asset[]> {
    let url = this.apiUrl;
    if (departmentId && departmentId !== 'all') {
      url += `?departmentId=${departmentId}`;
    }
    return this.http.get<Asset[]>(url);
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
