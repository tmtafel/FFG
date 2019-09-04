import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  display: string;
  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private authService: AuthService, private modalService: NgbModal) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.authService.afAuth.user.subscribe(e => {
        if (e !== null) {
          this.email = e.email;
          if (e.displayName) {
            this.display = e.displayName;
          } else {
            this.display = e.email;
          }
        }
      });
    }
  }

  login() {
    this.authService.login(this.signInForm.value.email, this.signInForm.value.password).then(result => {
      if (result) {
        console.log(result);
        this.modalService.dismissAll();
      }
    }

    );
  }
  open(content) {
    this.modalService.open(content);
  }

  logout() {
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
