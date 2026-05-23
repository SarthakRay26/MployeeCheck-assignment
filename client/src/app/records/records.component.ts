import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RecordService } from '../services/record.service';
import { VerificationRecord } from '../models/record.model';
import { Pagination } from '../models/api.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  displayedColumns = ['employeeName', 'company', 'verificationType', 'status', 'submittedDate', 'accessLevel'];
  dataSource = new MatTableDataSource<VerificationRecord>([]);
  records: VerificationRecord[] = [];
  pagination: Pagination = { page: 1, limit: 10, total: 0, pages: 0 };
  isLoading = true;
  error = '';

  // Filters
  searchQuery = '';
  statusFilter = '';
  sortBy = 'submittedDate';
  sortOrder: 'asc' | 'desc' = 'desc';

  private searchSubject = new Subject<string>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private recordService: RecordService) {}

  ngOnInit(): void {
    this.loadRecords();

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery = query;
        this.pagination.page = 1;
        this.loadRecords();
      });
  }

  loadRecords(): void {
    this.isLoading = true;
    this.error = '';

    this.recordService
      .getRecords({
        page: this.pagination.page,
        limit: this.pagination.limit,
        search: this.searchQuery,
        status: this.statusFilter,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        delay: 1000,
      })
      .subscribe({
        next: (response) => {
          this.records = response.data;
          this.dataSource.data = response.data;
          this.pagination = response.pagination;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to load records. Please try again.';
          this.isLoading = false;
        },
      });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pagination.page = 1;
    this.loadRecords();
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadRecords();
  }

  onSortChange(sort: Sort): void {
    this.sortBy = sort.active || 'submittedDate';
    this.sortOrder = (sort.direction as 'asc' | 'desc') || 'desc';
    this.loadRecords();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.sortBy = 'submittedDate';
    this.sortOrder = 'desc';
    this.pagination.page = 1;
    this.loadRecords();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'verified': return 'status-verified';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getAccessLevelClass(level: string): string {
    switch (level) {
      case 'Confidential': return 'access-confidential';
      case 'Level 3': return 'access-high';
      case 'Level 2': return 'access-medium';
      default: return 'access-low';
    }
  }
}
