import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { AppGuard } from './app.guard';
import { ListComponent } from './draft/list/list.component';
import { AllComponent } from './users/all/all.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LeaderboardComponent
  },
  {
    path: 'draft',
    component: ListComponent,
    canActivate: [AppGuard]
  },
  {
    path: 'users',
    component: AllComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
