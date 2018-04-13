import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceDashboardPage } from './invoice-dashboard';

@NgModule({
  declarations: [
    InvoiceDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceDashboardPage),
  ],
})
export class InvoiceDashboardPageModule {}
