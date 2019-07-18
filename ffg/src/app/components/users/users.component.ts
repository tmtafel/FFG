import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<any>;
  newUserForm: FormGroup;

  // tslint:disable-next-line:variable-name
  validation_messages = {
    name: [
      { type: 'required', message: 'First Name is required.' }
    ]
  };

  constructor(private modalService: NgbModal, private fb: FormBuilder, public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getData();
    this.createForm();
  }

  getData() {
    this.firebaseService.getUsers().subscribe(result => {
      this.users = result;
    });
  }

  createForm() {
    this.newUserForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  resetFields() {
    this.newUserForm = this.fb.group({
      name: new FormControl('', Validators.required)
    });
  }

  onSubmit(value) {
    this.firebaseService.createUser(value);
    this.resetFields();
    this.modalService.dismissAll();
  }

  open(content) {
    this.modalService.open(content);
  }
}
