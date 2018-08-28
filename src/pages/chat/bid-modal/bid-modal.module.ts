import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BidModalPage } from './bid-modal';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    BidModalPage,
  ],
  imports: [
    IonicPageModule.forChild(BidModalPage),
    PipesModule
  ],
})
export class BidModalPageModule {}
