import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllComponent } from './all/all.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [AllComponent, UserComponent],
  imports: [
    CommonModule
  ]
})

export class UsersModule { }
