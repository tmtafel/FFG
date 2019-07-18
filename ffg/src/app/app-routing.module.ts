import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DraftComponent } from './components/draft/draft.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', component: LeaderboardComponent },
  { path: 'draft', component: DraftComponent },
  { path: 'draft/:draftId', component: DraftComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
