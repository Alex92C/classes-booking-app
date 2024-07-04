import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private itemSource = new BehaviorSubject<any>(null);
  currentItem = this.itemSource.asObservable();

  constructor() { }

  updateItem(item: any): void {
    this.itemSource.next(item);
  }
}
