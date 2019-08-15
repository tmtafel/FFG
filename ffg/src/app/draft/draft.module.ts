import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraftRoutingModule } from './draft-routing.module';

import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { TeamComponent } from './team/team.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    TeamComponent
  ],
  imports: [
    CommonModule,
    DraftRoutingModule
  ]
})
export class DraftModule { }
