import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultiOrderPage } from './multi-order';

@NgModule({
  declarations: [
    MultiOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(MultiOrderPage),
  ],
})
export class MultiOrderPageModule {}
