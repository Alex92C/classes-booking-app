import { Injectable } from '@angular/core';
import { IClassItem } from '../models/class';
import { BehaviorSubject, Observable, Subject, filter, map, switchMap } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { EncodingService, IEncodedClassItem } from './encoding.service';

@Injectable({
  providedIn: 'root'
})
export class ClassItemService {

  private classItemsSubject: BehaviorSubject<IClassItem[]>;
  public classItems$!: Observable<IClassItem[]>;
  public filteredClassItems$!: Observable<IClassItem[]>;
  viewAllClicked$ = new BehaviorSubject<boolean>(false);



  constructor(
    private firestoreService: FirestoreService,
    private encodingService: EncodingService
  ) {
    this.classItemsSubject = new BehaviorSubject<IClassItem[]>([]);

    this.firestoreService.getClasses().subscribe(classes => {
      console.log('Fetched classes:', classes);
      this.classItemsSubject.next(this.generateRcurringClassItems(classes));
    });
  }

  // constructor() {
  //   const mockItems: IClassItem[] = [
  //     {
  //       uid: '1',
  //       date: '2024-04-15',
  //       recurrence: 7,
  //       time: '10:00 AM',
  //       class: 'Pilates',
  //       instructor: 'Alex',
  //       description: 'Total body workout that focuses on strengthening the core and toning the body, improves flexibility and prevent back pain.',
  //       image: '../assets/Pilates icon.jpeg',
  //       location: 'Room 101',
  //       maxAttendance: 15
  //     },
  //     {
  //       uid: '2',
  //       date: '2024-04-16',
  //       recurrence: 7,
  //       time: '11:00 AM',
  //       class: 'Zumba',
  //       instructor: 'John',
  //       description: 'Fun and energetic workout that combines Latin and international music with dance moves.',
  //       image: '../assets/Zumba icon.jpeg',
  //       location: 'Room 102',
  //       maxAttendance: 20
  //     },
  //     {
  //       uid: '3',
  //       date: '2024-04-17',
  //       recurrence: 7,
  //       time: '12:00 PM',
  //       class: 'Pilates',
  //       instructor: 'Sarah',
  //       description: 'Low-impact flexibility, muscular strength and endurance movements.',
  //       image: '../assets/Pilates icon.jpeg',
  //       location: 'Room 103',
  //       maxAttendance: 15
  //     }
  //   ];

  //   this.classItemsSubject = new BehaviorSubject<IClassItem[]>(this.generateRcurringClassItems(mockItems));
  // }

  generateRcurringClassItems(items: IClassItem[]): IClassItem[] {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 28);

    const recurringItems: IClassItem[] = [];

    for (const item of items) {
      let nextDate = new Date(item.date);
      while (nextDate <= endDate) {
        const newItem: IClassItem & { classItemId?: string } = { ...item, date: nextDate.toISOString().split('T')[0] };
        // Prepare the item for encoding
        const encodedClassItem: IEncodedClassItem = {
          date: newItem.date,
          time: newItem.time,
          classCode: newItem.classCode,
          instructorCode: newItem.instructorCode,
          statusCode: 'A' // Assuming 'A' is a default status code
        };
        // Encode the class item to generate classItemId
        newItem.classItemId = this.encodingService.encodeClassItem(encodedClassItem);
        recurringItems.push(newItem);

        nextDate.setDate(nextDate.getDate() + item.recurrence);
      }
    }
    recurringItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return recurringItems;
  }

  // generateRcurringClassItems(items: IClassItem[]): IClassItem[] {
  //   const today = new Date();
  //   const endDate = new Date();
  //   endDate.setDate(today.getDate() + 28);

  //   const recurringItems: IClassItem[] = [];

  //   for (const item of items) {
  //     let nextDate = new Date(item.date);
  //     while (nextDate <= endDate) {
  //       const newItem = { ...item, date: nextDate.toISOString().split('T')[0] };
  //       recurringItems.push(newItem);

  //       nextDate.setDate(nextDate.getDate() + item.recurrence);
  //     }
  //   }
  //   recurringItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  //   return recurringItems;
  // }


  getClassItems(): Observable<IClassItem[]> {
    return this.classItemsSubject.asObservable();
  }


  filterByDate(date: Date): void {
    this.filteredClassItems$ = this.getClassItems().pipe(
      map(items => items.filter(item => new Date(item.date).toDateString() === date.toDateString()))
    );
    console.log(date);
  }

  getFilteredClassItems(): Observable<IClassItem[]> {
    return this.viewAllClicked$.pipe(
      switchMap(viewAllClicked => viewAllClicked ? this.getClassItems() : this.filteredClassItems$)
    );
  }

  onViewAllClick(): void {
    this.viewAllClicked$.next(true);
  }

  onViewFilteredClick(): void {
    this.viewAllClicked$.next(false);
  }

}
