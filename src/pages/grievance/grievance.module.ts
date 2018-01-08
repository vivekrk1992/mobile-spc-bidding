import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrievancePage } from './grievance';

@NgModule({
  declarations: [
    GrievancePage,
  ],
  imports: [
    IonicPageModule.forChild(GrievancePage),
  ],
})
export class GrievancePageModule {}
