import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ListViewItemComponent } from '../list-view-item/list-view-item.component';
import { CalendarModule } from 'primeng/calendar';
import { NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClassItemService } from '../../services/classItem.service';
import { EncodingService, IEncodedBookingItem, IEncodedClassItem } from '../../services/encoding.service';



@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, ListViewItemComponent, CalendarModule, FormsModule, ReactiveFormsModule],
})
export class HomeComponent {
  // private classes: AngularFirestoreCollection<any>;

  constructor(
    public usersService: UsersService,
    private classItemService: ClassItemService,
    /// testing
    // private afs: AngularFirestore
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 8 * 7);
    // this.classes = this.afs.collection('classes');

    // this.getAllDocuments().subscribe(docs => {
    //   this.documents = docs;
    //   console.log('Documents:', this.documents);
    // });
  }

  // TESTING ENCODING
  service = new EncodingService();






  ngOnInit(): void {
    const mockClassItem: IEncodedClassItem = {
      date: '2024-06-22',
      time: '13:00',
      classCode: 'PL0',
      instructorCode: 'AL0',
      statusCode: 'A'
    };
    const encodedClass = this.service.encodeClassItem(mockClassItem);
    console.log("encoded class:", encodedClass);
    const decodedClass = this.service.decodeClassItem(encodedClass);
    console.log("decoded class:", decodedClass);

    const mockBookingItem: IEncodedBookingItem = {
      date: '18-04-24',
      time: '13:00',
      statusCode: 'A',
      userId: '2d506c8e-a309-45d8-ba93-c0bbf7663e57'
    };
    const encodedBooking = this.service.encodeBookingItem(mockBookingItem);
    console.log("encoded booking:", encodedBooking);
    const decodedBooking = this.service.decodeBookingItem(encodedBooking);
    console.log("decoded booking:", decodedBooking);
  }
  // END OF TESTING ENCODING

  //note: changed import to AngularFirestoreDocument
  // addDocument(data: any): Promise<AngularFirestoreDocument<any>> {
  //   const docRef = this.classes.doc(); // Get the document reference
  //   return docRef.set(data).then(() => docRef); // Set data and return the reference
  // }

  // onAddDocument() {
  //   const data = {
  //     uid: '3',
  //     date: '2024-04-17',
  //     recurrence: 7,
  //     time: '12:00 PM',
  //     class: 'Pilates',
  //     instructor: 'Sarah',
  //     description: 'Low-impact flexibility, muscular strength and endurance movements.',
  //     image: '../assets/Pilates icon.jpeg',
  //     location: 'Room 103',
  //     maxAttendance: 15
  //   };

  //   this.addDocument(data)
  //     .then(docRef => {
  //       console.log('Document added with ID:', docRef);
  //     })
  //     .catch(error => {
  //       console.error('Error adding document:', error);
  //     });
  // }

  // documents: any[] = [];

  // getAllDocuments(): Observable<any[]> {
  //   return this.classes.valueChanges();
  // }

  private _selectedDate: Date = new Date();

  get selectedDate(): Date {
    return this._selectedDate;
  }

  set selectedDate(value: Date) {
    this._selectedDate = value;
    this.classItemService.filterByDate(this.selectedDate);
    this.classItemService.onViewFilteredClick();
  }
  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentUser = this.usersService.currentUserProfile;
  viewAllClicked$ = this.classItemService.viewAllClicked$;



  onViewAllClick(): void {
    this.classItemService.onViewAllClick();
  }


}
