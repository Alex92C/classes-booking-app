import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="container center-text">
      <h1>Congratulations! You reached the homepage</h1>
      <img
        width="120"
        height="120"
        class="mat-elevation-z1"
        [src]="currentUser()?.photoURL ?? '/assets/image-placeholder.png'"
        alt="profile image"
      />
      <h2>{{ currentUser()?.displayName }} welcome inside our app!</h2>
      <p>
        Please use the top-right navigation menu to visit your profile page.
        There, you will be able to change your details and upload or change the
        profile image. Any changes you make will be reflected on the databse and
        in the user-interface in real time.
      </p>
      <p>
        Try also logging out and logging back using Google Sign-in to check all
        the functionalities. Don't worry about the password, you can always
        change it anytime using "Forgot Password"!
      </p>
    </div>
  `,
  styles: `
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background-color: rgba(255, 255, 255, 0.6);
    z-index: -5;
    border-radius: 10px;
   max-width: 50%;
   min-width: 300px;
   margin: 0 auto;
   box-sizing: border-box;
   padding: 20px;
    

    > img {
      border-radius: 5%;
      
    } 
  }
  `,
})
export class HomeComponent {
  constructor(public usersService: UsersService) {}

  currentUser = this.usersService.currentUserProfile;
}
