import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  email: string;


  constructor(private authService: AuthService, private modalService: NgbModal) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.authService.afAuth.user.subscribe(e => {
        if (e !== null) {
          this.email = e.email;
        }
      });
    }
  }

  open(content) {
    this.modalService.open(content);
  }

  logout() {
    localStorage.removeItem('user');
    this.authService.logout();
  }
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.email = signInSuccessData.authResult.user.email;
    this.modalService.dismissAll();
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log(errorData);
  }
}
