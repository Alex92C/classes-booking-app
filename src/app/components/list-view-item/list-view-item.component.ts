import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IClassItem } from '../../models/class';
import { ClassItemService } from '../../services/classItem.service';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';



@Component({
  selector: 'app-list-view-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-view-item.component.html',
  styleUrl: './list-view-item.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListViewItemComponent implements OnInit, OnChanges {

  public classItems$!: Observable<IClassItem[]>;
  @Input() selectedDate!: Date;

  constructor(
    private classItemService: ClassItemService,
    private bookingService: BookingService,
    private router: Router
  ) {
  }

  showDetails = false;
  public openedIndex: number | null = null;




  ngOnInit(): void {
    this.classItems$ = this.classItemService.getClassItems();
    this.classItems$.subscribe(items => {
      console.log("classItems observable:", items);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.classItems$ = this.classItemService.getFilteredClassItems();
  }

  public toggleDetails(idx: number): void {
    this.openedIndex = this.openedIndex === idx ? null : idx;
  }

  onBookClick(item: any): void {
    console.log("BOOKING ITEM", item);
    this.bookingService.updateItem(item);
    this.router.navigate(['/booking']);
  }

}
