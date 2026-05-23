import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VerificationRecord, RecordStats } from '../models/record.model';
import { ApiResponse, PaginatedResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class RecordService {
  private readonly apiUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    company?: string;
    verificationType?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    delay?: number;
  }): Observable<PaginatedResponse<VerificationRecord>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<VerificationRecord>>(this.apiUrl, {
      params: httpParams,
    });
  }

  getStats(delay?: number): Observable<ApiResponse<RecordStats>> {
    let httpParams = new HttpParams();
    if (delay) httpParams = httpParams.set('delay', delay.toString());

    return this.http.get<ApiResponse<RecordStats>>(`${this.apiUrl}/stats`, {
      params: httpParams,
    });
  }
}
