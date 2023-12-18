import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  template: `
    <div class="card mat-elevation-z5">
      <h1>Login</h1>
      <div class="center">
        <img
          class="social-sign-in"
          role="button"
          src="/assets/google-sign-in.png"
          alt="Google Sign In"
          width="70%"
          (click)="googleSignIn()"
        />
      </div>
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <mat-form-field>
          <input matInput placeholder="Email" formControlName="email" />
          <mat-error *ngIf="email?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="email?.hasError('email')">
            Email is invalid
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <input
            matInput
            type="password"
            placeholder="Password"
            formControlName="password"
          />
          <mat-error *ngIf="password?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>
        <div class="center margin-top">
          <button mat-raised-button type="submit" color="primary">Login</button>
        </div>
        <div class="login-footer">
          <a class="sign-up" routerLink="/sign-up">Sign up!</a>
          <a (click)="forgotPassword()"> Forgot Password?</a>
        </div>
      </form>
    </div>
  `,
  styles: `



.social-sign-in {
  cursor: pointer;
  margin-bottom: 48px;
  border-radius: 10px;
  
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;

  .sign-up {
    font-size: 1rem;
    margin-left: 8px;
  }


  a {
    cursor: pointer;
    text-decoration: underline;
    color: darkblue;
  }
}

 

  
  `,
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private usersService: UsersService
  ) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async login() {
    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    try {
      this.notifications.showLoading();
      await this.authService.login(email, password);
      this.router.navigate(['/home']);
      this.notifications.success('Logged in successfully!');
    } catch (err: any) {
      this.notifications.firebaseError(err);
    } finally {
      this.notifications.hideLoading();
    }
  }

  async forgotPassword() {
    const { email } = this.loginForm.value;

    if (!email) {
      this.notifications.error('Please enter your email address');
      return;
    }

    try {
      this.notifications.showLoading();
      await this.authService.passwordReset(email);
      this.notifications.success(
        'Password reset email has been sent! Please check your inbox.'
      );
    } catch (err: any) {
      this.notifications.firebaseError(err);
    } finally {
      this.notifications.hideLoading();
    }
  }

  async googleSignIn() {
    try {
      this.notifications.showLoading();
      const newUser = await this.authService.googleSignIn();
      if (newUser) {
        await this.usersService.addUser(newUser);
      }
      this.router.navigate(['/home']);
      this.notifications.success('Logged in successfully!');
    } catch (err: any) {
      this.notifications.firebaseError(err);
    } finally {
      this.notifications.hideLoading();
    }
  }

  email = this.loginForm.get('email');
  password = this.loginForm.get('password');
}
