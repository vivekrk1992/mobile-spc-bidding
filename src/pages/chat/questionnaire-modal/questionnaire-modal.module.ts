import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionnaireModalPage } from './questionnaire-modal';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    QuestionnaireModalPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireModalPage),
    PipesModule
  ],
})
export class QuestionnaireModalPageModule {}
