import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderModalPage } from './order-modal';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrderModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderModalPage),
    PipesModule
  ],
})
export class OrderModalPageModule {}
