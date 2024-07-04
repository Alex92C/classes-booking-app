import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyCphgERUj35At-654qy0EP0olgTu3coXa0',
  authDomain: 'angular-auth-app-da196.firebaseapp.com',
  projectId: 'angular-auth-app-da196',
  storageBucket: 'angular-auth-app-da196.appspot.com',
  messagingSenderId: '814709841087',
  appId: '1:814709841087:web:adf25e1633db39bbc77a0a',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      AngularFireModule.initializeApp(firebaseConfig), // initialize
      AngularFirestoreModule,
      MatSnackBarModule,
      CommonModule,
      HttpClientModule,

    ]),
  ],
};
