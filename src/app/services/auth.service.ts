import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup } from '@angular/fire/auth';
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { create } from 'domain';
import { ProfileUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);

  currentUser$ = authState(this.firebaseAuth);
  currentUser = toSignal(this.currentUser$);

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }

  googleProvider = new GoogleAuthProvider();

  async googleSignIn(): Promise<ProfileUser | null> {
    const userCredential = await signInWithPopup(
      this.firebaseAuth,
      this.googleProvider
    );
    const additionalInfo = getAdditionalUserInfo(userCredential);

    if (!additionalInfo?.isNewUser) {
      return Promise.resolve(null);
    }

    const {
      user: { displayName, uid, photoURL, email },
    } = userCredential;

    const newProfile = {
      displayName: displayName ?? '',
      uid,
      email: email ?? '',
      photoURL: photoURL ?? '',
    };

    return Promise.resolve(newProfile);
  }

  logout(): Promise<void> {
    return signOut(this.firebaseAuth);
  }

  constructor() {}
}
