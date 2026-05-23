import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  success(message: string, duration = 4000): void {
    this.addToast({ message, type: 'success', duration });
  }

  error(message: string, duration = 5000): void {
    this.addToast({ message, type: 'error', duration });
  }

  warning(message: string, duration = 4000): void {
    this.addToast({ message, type: 'warning', duration });
  }

  info(message: string, duration = 4000): void {
    this.addToast({ message, type: 'info', duration });
  }

  dismiss(id: number): void {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter((t) => t.id !== id));
  }

  private addToast(toast: Omit<ToastMessage, 'id'>): void {
    const id = ++this.counter;
    const newToast: ToastMessage = { ...toast, id };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, newToast]);

    if (toast.duration) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
  }
}
