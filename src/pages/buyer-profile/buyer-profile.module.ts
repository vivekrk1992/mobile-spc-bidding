import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyerProfilePage } from './buyer-profile';

@NgModule({
  declarations: [
    BuyerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(BuyerProfilePage),
  ],
})
export class BuyerProfilePageModule {}
