import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { IClassItem } from '../models/class';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app"
import { IBookingItem } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private classes: AngularFirestoreCollection<any>;
  private classBookings: AngularFirestoreCollection<any>;
  private users: AngularFirestoreCollection<any>;
  // documents: any[] = [];
  // private classesUrl = 'https://firestore.googleapis.com/v1/projects/angular-auth-app-da196/docDatabases/(default)/documents/classes';

  constructor(private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.classes = this.afs.collection('classes');
    this.classBookings = this.afs.collection('classBookings');
    this.users = this.afs.collection('users');


    // this.getAllDocuments().subscribe(docs => {
    //   this.documents = docs;
    //   console.log('Documents:', this.documents);
    // });
  }

  getClasses(): Observable<IClassItem[]> {
    return this.classes.valueChanges();
  }

  getBookings(userId: string): Observable<IBookingItem[]> {
    console.log('getting bookings for user:', userId);
    return this.afs.collection(`users/${userId}/bookings`).valueChanges() as Observable<IBookingItem[]>;
  }

  getLatestBookings(userId: string): Observable<IBookingItem[]> {
    console.log('getting latest booking for user:', userId);
    return this.afs.collection(`users/${userId}/bookings`, ref => ref
      .orderBy('createdAt', 'desc')
      .limit(5)
    ).valueChanges() as Observable<IBookingItem[]>;
  }

  addClassItem(docData: any): Promise<AngularFirestoreDocument<any>> {
    const docRef = this.classes.doc(); // Get the document reference
    return docRef.set(docData).then(() => docRef); // Set docData and return the reference
  }

  addClassBookingItem(uid: string, docData: any): Promise<AngularFirestoreDocument<any>> {
    const docRef = this.classBookings.doc(uid); // Get the document reference
    return docRef.set(docData).then(() => docRef); // Set docData and return the reference
  }

  // addBookingItem(classBookingId: string, bookingId: string, docData: any): Promise<void> {
  //   const classBookingRef = this.classBookings.doc(classBookingId);
  //   const bookingRef = classBookingRef.collection('bookings').doc(bookingId);
  //   const docDataWithTimestamp = {
  //     ...docData,
  //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //   };
  //   return bookingRef.set(docDataWithTimestamp, { merge: true })
  //     .then(() => {
  //       console.log("Document successfully written!");
  //     })
  //     .catch((error) => {
  //       console.error("Error writing document: ", error);
  //     });
  // }

  addBookingItem(classBookingId: string, bookingId: string, userId: string, bookingData: any, userData: any): Promise<void> {
    const classBookingRef = this.classBookings.doc(classBookingId);
    const bookingRef = classBookingRef.collection('bookings').doc(bookingId);
    const timeStamp = firebase.firestore.FieldValue.serverTimestamp();

    const bookingDataVariables = {
      ...bookingData,
      createdAt: timeStamp
    };

    return bookingRef.set(bookingDataVariables, { merge: true })
      .then(() => {
        // Set doc in users collection
        const usergRef = this.users.doc(userId);
        const userBookingsRef = usergRef.collection('bookings').doc(classBookingId);

        const userDataVariables = {
          ...userData,
          createdAt: timeStamp
        };

        return userBookingsRef.set(userDataVariables, { merge: true });
      })
      .then(() => {
        console.log("Documents successfully written!");
      })
      .catch((error) => {
        console.error("Error writing documents: ", error);
      });
  }

  // ADD CLASS TEMPLATE (for reference)

  // onAddDocument() {
  //   const docData = {
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

  //   this.addDocument(docData)
  //     .then(docRef => {
  //       console.log('Document added with ID:', docRef);
  //     })
  //     .catch(error => {
  //       console.error('Error adding document:', error);
  //     });
  // }





}
