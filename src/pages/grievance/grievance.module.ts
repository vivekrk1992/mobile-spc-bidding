import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrievancePage } from './grievance';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GrievancePage,
  ],
  imports: [
    IonicPageModule.forChild(GrievancePage),
    TranslateModule.forChild()
  ],
})
export class GrievancePageModule {}
