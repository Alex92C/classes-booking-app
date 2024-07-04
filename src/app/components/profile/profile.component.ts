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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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
