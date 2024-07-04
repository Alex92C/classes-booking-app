import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { IClassItem } from '../models/class';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private classes: AngularFirestoreCollection<any>;
  // documents: any[] = [];
  // private classesUrl = 'https://firestore.googleapis.com/v1/projects/angular-auth-app-da196/databases/(default)/documents/classes';

  constructor(private http: HttpClient,
    private afs: AngularFirestore
  ) {
    this.classes = this.afs.collection('classes');

    // this.getAllDocuments().subscribe(docs => {
    //   this.documents = docs;
    //   console.log('Documents:', this.documents);
    // });
  }

  getClasses(): Observable<IClassItem[]> {
    return this.classes.valueChanges();
  }

  addDocument(data: any): Promise<AngularFirestoreDocument<any>> {
    const docRef = this.classes.doc(); // Get the document reference
    return docRef.set(data).then(() => docRef); // Set data and return the reference
  }

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





}
