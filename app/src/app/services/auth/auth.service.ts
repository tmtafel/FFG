import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(public afAuth: AngularFireAuth, public router: Router, private fns: AngularFireFunctions) {
    this.user = afAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        } else {
          this.userDetails = null;
        }
      }
    );
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      return this.afAuth;
    } catch (e) {
      return e;
    }
  }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
  }

  get isLoggedIn(): boolean {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }

  get isAdmin(): boolean {
    try {
      return JSON.parse(localStorage.getItem('admin'));
    } catch (error) {
      return false;
    }
  }

  public getAllUsers() {
    const callable = this.fns.httpsCallable('getUsers');
    return callable({});
  }

  addAdmin(e: string): Observable<any> {
    const callable = this.fns.httpsCallable('addAdmin');
    return callable({ email: e });
  }

  removeAdmin(e: string): Observable<any> {
    const callable = this.fns.httpsCallable('removeAdmin');
    return callable({ email: e });
  }
}
