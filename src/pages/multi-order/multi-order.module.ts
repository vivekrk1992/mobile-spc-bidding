import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultiOrderPage } from './multi-order';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MultiOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(MultiOrderPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class MultiOrderPageModule {}
