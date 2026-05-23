import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.status === 401) {
        errorMessage = error.error?.message || 'Session expired. Please log in again.';
        authService.logout();
      } else if (error.status === 403) {
        errorMessage = error.error?.message || 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = error.error?.message || 'Resource not found.';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'Resource already exists.';
      } else if (error.status === 422) {
        errorMessage = error.error?.message || 'Validation failed.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      // Don't show toast for login failures (handled by login component)
      if (!req.url.includes('/auth/login')) {
        notification.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
