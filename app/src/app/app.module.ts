import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PlayerComponent } from './components/player/player.component';


import { FirebaseUIModule } from 'firebaseui-angular';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
// import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';


import { environment } from '../environments/environment';
import { DraftModule } from './draft/draft.module';
import { UsersModule } from './users/users.module';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './services/auth/auth.service';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: 'https://accounts.google.com',
      clientId: '328826912224-sgghc1dcimi57pr8ni9g90ofs6fhh6da.apps.googleusercontent.com'
    },
  ],
  tosUrl: 'https://tinkletons.com/',
  privacyPolicyUrl: 'https://tinkletons.com/'
};
@NgModule({
  declarations: [
    AppComponent,
    LeaderboardComponent,
    PlayerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ReactiveFormsModule,
    NgbModule.forRoot(),
    DraftModule,
    UsersModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
