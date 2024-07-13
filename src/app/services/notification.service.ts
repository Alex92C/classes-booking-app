import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import { getFirebaseErrorMessage } from '../utilities/auth-errors';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  loading = signal(false);
  
  private __notificationSource = new BehaviorSubject<string>('');
  public notification$ = this.__notificationSource.asObservable();

  showLoading() {
    this.loading.set(true);
  }

  hideLoading() {
    this.loading.set(false);
  }

  snackbar = inject(MatSnackBar);
  success(message: string) {
    this.snackbar.open(message, undefined, {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['green-snackbar'],
    });
  }

  error(message: string) {
    this.snackbar.open(message, 'Close', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar']
    });
  }

  notify(message: string) {
    console.log('Notification:', message);
    this.__notificationSource.next(message);
  }

  firebaseError(err: FirebaseError) {
    this.error(getFirebaseErrorMessage(err));
  }
}
