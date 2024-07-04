import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { EMPTY, Observable } from 'rxjs';
import { IClassItem } from '../../models/class';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  item$: Observable<IClassItem | null> = EMPTY;

  constructor(
    private bookingService: BookingService,
  ) { }

  ngOnInit(): void {
    this.item$ = this.bookingService.currentItem;
    this.item$.subscribe(item => {
      console.log("passed booking item:", item);
    });
  }
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
