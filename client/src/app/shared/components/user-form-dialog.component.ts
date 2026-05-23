import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface UserFormDialogData {
  mode: 'create' | 'edit';
  user?: {
    email: string;
    name: string;
    role: string;
  };
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="form-dialog">
      <h2>{{ data.mode === 'create' ? 'Create New User' : 'Edit User' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter full name" />
          <mat-icon matPrefix>person</mat-icon>
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Enter email" />
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="data.mode === 'create'">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" placeholder="Enter password" />
          <mat-icon matPrefix>lock</mat-icon>
          <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
          <mat-error *ngIf="form.get('password')?.hasError('minlength')">Min 6 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="Admin">Admin</mat-option>
            <mat-option value="General User">General User</mat-option>
          </mat-select>
          <mat-icon matPrefix>admin_panel_settings</mat-icon>
        </mat-form-field>

        <div class="dialog-actions">
          <button mat-stroked-button type="button" (click)="dialogRef.close()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
            {{ data.mode === 'create' ? 'Create User' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-dialog {
      padding: 24px;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 20px;
      color: var(--text-primary);
    }

    .full-width {
      width: 100%;
      margin-bottom: 4px;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 12px;

      button {
        border-radius: 10px !important;
        height: 40px;
        min-width: 120px;
      }
    }
  `],
})
export class UserFormDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData
  ) {
    if (data.mode === 'create') {
      this.form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['General User', Validators.required],
      });
    } else {
      this.form = this.fb.group({
        name: [data.user?.name || '', Validators.required],
        email: [data.user?.email || '', [Validators.required, Validators.email]],
        role: [data.user?.role || 'General User', Validators.required],
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
