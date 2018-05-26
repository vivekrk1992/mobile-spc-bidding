import { NgModule } from '@angular/core';
import { ShortDatePipe } from './short-date/short-date';
import { RmUnderScorePipe } from './rm-under-score/rm-under-score';
import { StartTimerPipe } from './start-timer/start-timer';
@NgModule({
	declarations: [
		ShortDatePipe,
		RmUnderScorePipe,
    StartTimerPipe
	],
	imports: [],
	exports: [
		ShortDatePipe,
		RmUnderScorePipe,
    StartTimerPipe
	]
})
export class PipesModule {}
