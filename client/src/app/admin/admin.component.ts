import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { User } from '../models/user.model';
import { Pagination } from '../models/api.model';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog.component';
import { UserFormDialogComponent } from '../shared/components/user-form-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  displayedColumns = ['name', 'email', 'role', 'isActive', 'lastLogin', 'actions'];
  users: User[] = [];
  dataSource = new MatTableDataSource<User>([]);
  pagination: Pagination = { page: 1, limit: 10, total: 0, pages: 0 };
  isLoading = true;
  searchQuery = '';

  constructor(
    private userService: UserService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userService
      .getUsers({
        page: this.pagination.page,
        limit: this.pagination.limit,
        search: this.searchQuery,
        delay: 800,
      })
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.dataSource.data = response.data;
          this.pagination = response.pagination;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: () => {
            this.notification.success('User created successfully');
            this.loadUsers();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to create user');
          },
        });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      data: { mode: 'edit', user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const userId = user._id || user.id;
        this.userService.updateUser(userId, result).subscribe({
          next: () => {
            this.notification.success('User updated successfully');
            this.loadUsers();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to update user');
          },
        });
      }
    });
  }

  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const userId = user._id || user.id;
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.notification.success('User deleted successfully');
            this.loadUsers();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to delete user');
          },
        });
      }
    });
  }

  toggleActive(user: User): void {
    const userId = user._id || user.id;
    this.userService
      .updateUser(userId, { isActive: !user.isActive })
      .subscribe({
        next: () => {
          this.notification.success(
            `User ${!user.isActive ? 'activated' : 'deactivated'} successfully`
          );
          this.loadUsers();
        },
        error: (err) => {
          this.notification.error(err.error?.message || 'Failed to update user status');
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadUsers();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.pagination.page = 1;
    this.loadUsers();
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
