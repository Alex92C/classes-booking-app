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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private usersService: UsersService
  ) { }

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
