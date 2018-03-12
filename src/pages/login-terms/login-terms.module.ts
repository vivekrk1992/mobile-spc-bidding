import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginTermsPage } from './login-terms';

@NgModule({
  declarations: [
    LoginTermsPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginTermsPage),
  ],
})
export class LoginTermsPageModule {}
