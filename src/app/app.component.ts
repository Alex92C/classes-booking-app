import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from './services/notification.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  template: `
    <!-- <div class="bg-image-full"> -->
    <div class="bg-video">
      <video autoplay muted loop>
        <source src="/assets/background.mp4" type="video/mp4" />
      </video>

      <mat-toolbar color="primary">
        Angular Sign Up App
        <button
          mat-button
          *ngIf="currentUser()"
          [mat-menu-trigger-for]="userMenu"
        >
          {{ currentUser()?.displayName }}
          <mat-icon>expand_more</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>account_circle</mat-icon>
            Profile
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </mat-toolbar>
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
    <!-- </div> -->
    <mat-progress-spinner
      mode="indeterminate"
      diameter="50"
      *ngIf="loading()"
    ></mat-progress-spinner>
  `,
  styles: [
    `
      .container {
        padding: 24px;
      }

      mat-toolbar {
        justify-content: space-between;
      }

      mat-progress-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    public notificationService: NotificationService,
    public usersService: UsersService
  ) {}

  currentUser = this.usersService.currentUserProfile;
  loading = this.notificationService.loading;

  async logout() {
    this.notificationService.showLoading();
    await this.authService.logout();
    this.notificationService.hideLoading();
    this.router.navigate(['/login']);
  }

  toProfile() {
    this.router.navigate(['/profile']);
  }
}
