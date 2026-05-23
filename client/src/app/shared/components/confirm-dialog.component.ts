import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'warn' | 'accent';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-icon" [class]="data.confirmColor || 'warn'">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="dialogRef.close(false)">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-flat-button
          [color]="data.confirmColor || 'warn'"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 24px;
      text-align: center;
    }

    .dialog-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      &.warn {
        background: rgba(239, 68, 68, 0.12);
        mat-icon { color: #ef4444; }
      }

      &.primary {
        background: rgba(99, 102, 241, 0.12);
        mat-icon { color: #6366f1; }
      }
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--text-primary);
    }

    p {
      font-size: 14px;
      color: var(--text-tertiary);
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: center;

      button {
        min-width: 100px;
        border-radius: 10px !important;
        height: 40px;
      }
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
