import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, CreateUserPayload, UpdateUserPayload } from '../models/user.model';
import { ApiResponse, PaginatedResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    delay?: number;
  }): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.role) httpParams = httpParams.set('role', params.role);
      if (params.isActive !== undefined) httpParams = httpParams.set('isActive', params.isActive.toString());
      if (params.delay) httpParams = httpParams.set('delay', params.delay.toString());
    }

    return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params: httpParams });
  }

  createUser(payload: CreateUserPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, payload);
  }

  updateUser(id: string, payload: UpdateUserPayload): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
