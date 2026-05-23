import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { RecordService } from '../services/record.service';
import { RecordStats, VerificationRecord } from '../models/record.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: RecordStats | null = null;
  recentRecords: VerificationRecord[] = [];
  isLoading = true;
  error = '';

  constructor(
    public authService: AuthService,
    private recordService: RecordService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = '';

    this.recordService.getStats(1500).subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
          this.recentRecords = response.data.recentActivity || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      },
    });
  }

  get verificationRate(): number {
    if (!this.stats || this.stats.total === 0) return 0;
    return Math.round((this.stats.verified / this.stats.total) * 100);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'verified': return 'status-verified';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}
