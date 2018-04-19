import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceDashboardPage } from './invoice-dashboard';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    InvoiceDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceDashboardPage),
    PipesModule
  ],
})
export class InvoiceDashboardPageModule {}
