import { IBookingItem } from './../../models/booking';
import { UsersService } from './../../services/users.service';
import { FirestoreService } from './../../services/firestore.service';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.scss'
})
export class BookingItemComponent {
  user: any;
  bookingItems = signal<IBookingItem[]>([])

  mockBookings: any = [{
    name: 'Zumba',
    img: 'assets/Pilates icon.jpeg',
    time: '15:00 am',
    trainer: 'Alex'
  },
  {
    name: 'Zumba',
    img: 'assets/Pilates icon.jpeg',
    time: '15:00 am',
    trainer: 'Alex'
  },
  {
    name: 'Zumba',
    img: 'assets/Pilates icon.jpeg',
    time: '15:00 am',
    trainer: 'Alex'
  }]

  constructor(
    private firestoreService: FirestoreService,
    private usersService: UsersService
  ) {
    this.user = this.usersService.currentUserData;
  }

  ngOnInit(): void {
    this.firestoreService.getLatestBookings(this.user.id).subscribe(bookings => {
      console.log('Bookings:', bookings);
      this.bookingItems.set(bookings);
    });
  }

  trackByIndex(index: number, item: any): number {
    return index; // or item.property if you have a unique property
  }

}


