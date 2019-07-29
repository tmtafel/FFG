import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
        this.email = e.email;
      });
    }
  }

  open(content) {
    this.modalService.open(content);
  }

  login(userEmail, userPassword): void {
    this.authService.login(userEmail.value, userPassword.value).then(result => {
      if (this.authService.isLoggedIn) {
        this.email = this.authService.user.email;
        this.modalService.dismissAll();
      }
    });
  }
}
