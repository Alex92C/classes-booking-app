import { FirebaseError } from '@angular/fire/app';

export const getFirebaseErrorMessage = ({ code }: FirebaseError): string => {
  let message;

  switch (code) {
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/invalid-credential':
      message =
        'Invalid credential, check your email and password and try again';
      break;
    case 'auth/wrong-password':
      message = 'Invalid password';
      break;
    case 'auth/user-not-found':
      message = 'User not found';
      break;
    case 'auth/email-already-in-use':
      message = 'Email already in use';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      break;
    default:
      message = 'Something went wrong';
  }

  return message;
};
