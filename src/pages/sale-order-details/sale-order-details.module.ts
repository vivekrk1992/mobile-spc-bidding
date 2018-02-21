import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaleOrderDetailsPage } from './sale-order-details';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SaleOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SaleOrderDetailsPage),
    PipesModule
  ],
})
export class SaleOrderDetailsPageModule {}
