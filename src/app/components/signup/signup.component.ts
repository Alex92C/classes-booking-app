import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="card mat-elevation-z5">
      <h1>Sign Up</h1>
      <form [formGroup]="signUpForm" (ngSubmit)="submit()">
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name" />
          <mat-error *ngIf="name?.hasError('required')"
            >Name is required</mat-error
          >
        </mat-form-field>
        <mat-form-field>
          <input
            matInput
            type="email"
            placeholder="Email address"
            formControlName="email"
          />
          <mat-error *ngIf="email?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="email?.hasError('email')">
            Enter a valid email address
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
        <mat-form-field>
          <input
            matInput
            type="password"
            placeholder="Confirm password"
            formControlName="confirmPassword"
          />
          <mat-error *ngIf="confirmPassword?.hasError('required')">
            Confirm password is required
          </mat-error>
        </mat-form-field>

        <mat-error *ngIf="signUpForm.hasError('passwordsDontMatch')">
          Passwords don't match
        </mat-error>

        <div class="center margin-top">
          <button mat-raised-button type="submit" color="primary">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class SignupComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private usersService: UsersService
  ) {}

  signUpForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator() }
  );

  async submit() {
    const { name, email, password } = this.signUpForm.value;

    if (!this.signUpForm.valid || !email || !password || !name) {
      return;
    }

    try {
      this.notifications.showLoading();
      const {
        user: { uid },
      } = await this.authService.signUp(email, password);
      await this.usersService.addUser({ uid, email, displayName: name });
      this.notifications.success('Signed up successfully!');
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.notifications.firebaseError(err);
    } finally {
      this.notifications.hideLoading();
    }
  }

  email = this.signUpForm.get('email');
  password = this.signUpForm.get('password');
  confirmPassword = this.signUpForm.get('confirmPassword');
  name = this.signUpForm.get('name');
}
