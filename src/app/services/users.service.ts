import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user';
import { setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Observable, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Storage, ref } from '@angular/fire/storage';
import { uploadBytes, getDownloadURL } from 'firebase/storage';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private storage: Storage
  ) {}

  private currentUserProfile$ = this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(null);
      }
      const ref = doc(this.firestore, 'users', user.uid);
      return docData(ref) as Observable<ProfileUser>;
    })
  );

  currentUserProfile = toSignal(this.currentUserProfile$);

  addUser(user: ProfileUser): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return setDoc(ref, user);
  }

  updateUser(user: ProfileUser): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return updateDoc(ref, { ...user });
  }

  async uploadProfilePhoto(image: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const result = await uploadBytes(storageRef, image);
    return await getDownloadURL(result.ref);
  }

}
