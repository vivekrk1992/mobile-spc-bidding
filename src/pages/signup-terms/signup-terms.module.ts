import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupTermsPage } from './signup-terms';

@NgModule({
  declarations: [
    SignupTermsPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupTermsPage),
  ],
})
export class SignupTermsPageModule {}
