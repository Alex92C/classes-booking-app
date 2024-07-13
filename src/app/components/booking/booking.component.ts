import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { catchError, EMPTY, Observable, of, Subscription } from 'rxjs';
import { IClassItem } from '../../models/class';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FirestoreService } from '../../services/firestore.service';
import { EncodingService, IEncodedBookingItem, IEncodedClassItem } from '../../services/encoding.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [NotificationService]
})
export class BookingComponent implements OnInit {

  private subscriptions$: Subscription[] = [];
  item$: Observable<IClassItem> = EMPTY;
  user: any;

  constructor(
    private bookingService: BookingService,
    private firestoreService: FirestoreService,
    private encodingService: EncodingService,
    private usersService: UsersService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.user = this.usersService.currentUserData;
  }

  ngOnInit(): void {
    this.item$ = this.bookingService.currentItem;
    const itemSubscription = this.bookingService.currentItem.subscribe(item => {
      console.log("passed booking item:", item);
    });
    this.subscriptions$.push(itemSubscription);
  }

  onConfirmBooking() {
    // Confirmation step
    const isConfirmed = window.confirm('Are you sure you want to proceed with the booking?');
    if (!isConfirmed) {
      console.log('Booking cancelled by user.');
      return;
    }

    const bookingSubscription = this.item$.pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return of(null);
      })
    ).subscribe(item => {
      if (!item) {
        console.log('No item to book');
        return;
      }

      const classItem: IEncodedClassItem = {
        date: item.date,
        time: item.time,
        classCode: item?.classCode,
        instructorCode: item.instructorCode,
        statusCode: 'A'
      };
      const encodedClassItem = this.encodingService.encodeClassItem(classItem);
      console.log("encoded class item:", encodedClassItem);

      const bookingItem: IEncodedBookingItem = {
        date: item.date,
        time: item.time,
        statusCode: 'A',
        userId: 'randomUserId3', // TODO change with actual user id after testing
      };
      const encodedBookingItem = this.encodingService.encodeBookingItem(bookingItem);
      console.log("encoded booking item:", encodedBookingItem);

      const bookingData = { fullName: this.user.fullName };

      const userData = {
        date: item.date,
        time: item.time,
        class: item.class,
        instructor: item.instructor,
        image: item.image,
      };

      this.firestoreService.addBookingItem(encodedClassItem, encodedBookingItem, this.user.id, bookingData, userData)
        .then(() => {
          this.notificationService.notify('Booking successful!');
          this.router.navigate(['/home']);
        })
        .catch(error => {
          console.error('Error adding booking item:', error);
          this.notificationService.error(
            'Error during booking. Please try again later.'
          );
        });
    });
    this.subscriptions$.push(bookingSubscription);
  }

  // data {
  //   users {
  //      user1 {
  //          ... Some values
  //          bookings {
  //              bookingItem1 {
  //                  invoiced: boolean
  //                 }
  //              }
  //          }
  //      user2 {...}
  //      user3 {...}
  //      }
  //   classes {
  //     classItem {
  //       bookingItem1: string
  //       bookingItem2: string
  //       bookingItem3: string
  //       }
  //     classItem {...}
  //     classItem {...}
  //   }
  // }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }
}
