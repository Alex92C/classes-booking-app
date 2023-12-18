import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="card mat-elevation-z5">
      <h1>Update Profile</h1>

      <div class="profile-image">
        <img
          width="120"
          height="120"
          class="mat-elevation-z1"
          [src]="currentUser()?.photoURL ?? '/assets/image-placeholder.png'"
          alt="profile image"
        />
        <button mat-mini-fab (click)="inputField.click()">
          <mat-icon>edit</mat-icon>
        </button>
      </div>
      <input #inputField type="file" hidden (change)="uploadFile($event)" />
      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
        <div class="row">
          <mat-form-field>
            <input
              matInput
              placeholder="First Name"
              formControlName="firstName"
            />
          </mat-form-field>
          <mat-form-field>
            <input
              matInput
              placeholder="Last Name"
              formControlName="lastName"
            />
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field>
            <input
              matInput
              placeholder="Display Name"
              formControlName="displayName"
            />
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Phone" formControlName="phone" />
          </mat-form-field>
        </div>
        <mat-form-field>
          <input matInput placeholder="Address" formControlName="address" />
        </mat-form-field>
        <div class="center margin-top">
          <button mat-raised-button type="submit" color="primary">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: `
  .row {
    display: flex;
    gap: 16px;
  }
  .profile-image {
    position: relative;
    width: 120px;
    margin: auto;


    > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
  }

  > button {
    position: absolute;
    bottom: 10px;
    right: 0;
  }
  }
  
  `,
})
export class ProfileComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    public usersService: UsersService
  ) {
    effect(() => {
      this.profileForm.patchValue({
        ...this.usersService.currentUserProfile(),
      });
    });
  }

  currentUser = this.usersService.currentUserProfile;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  async uploadFile(event: any) {
    const file = event.target.files[0];
    const currentUserId = this.currentUser()?.uid;

    if (!currentUserId || !file) {
      return;
    }

    try {
      this.notifications.showLoading();
      const photoURL = await this.usersService.uploadProfilePhoto(
        file,
        `images/profile/${currentUserId}`
      );
      await this.usersService.updateUser({ uid: currentUserId, photoURL });

      this.notifications.success('Profile photo uploaded successfully!');
    } catch (err: any) {
      this.notifications.firebaseError(err);
    } finally {
      this.notifications.hideLoading();
    }
  }

  async saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }

    try {
      this.notifications.showLoading();
      await this.usersService.updateUser({ uid, ...data });
      this.notifications.success('Profile updated successfully!');
    } catch (err: any) {
      this.notifications.firebaseError(err);
    } finally {
      this.notifications.hideLoading();
    }
  }
}
