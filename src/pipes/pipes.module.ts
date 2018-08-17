import { NgModule } from '@angular/core';
import { ShortDatePipe } from './short-date/short-date';
import { RmUnderScorePipe } from './rm-under-score/rm-under-score';
import { StartTimerPipe } from './start-timer/start-timer';
import { MomentPipe } from './moment/moment';
@NgModule({
	declarations: [
		ShortDatePipe,
		RmUnderScorePipe,
    StartTimerPipe,
    MomentPipe
	],
	imports: [],
	exports: [
		ShortDatePipe,
		RmUnderScorePipe,
    StartTimerPipe,
    MomentPipe
	]
})
export class PipesModule {}
