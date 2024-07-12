import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-item',
  standalone: true,
  imports: [],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.scss'
})
export class BookingItemComponent {

className: any = {name: 'Zumba', 
                  img: 'assets/Pilates icon.jpeg',
                  time: '15:00 am',
                  trainer: 'Alex'
                }

}


