import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultiOrderPage } from './multi-order';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MultiOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(MultiOrderPage),
    PipesModule,
  ],
})
export class MultiOrderPageModule {}
