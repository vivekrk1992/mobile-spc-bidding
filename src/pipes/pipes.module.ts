import { NgModule } from '@angular/core';
import { ShortDatePipe } from './short-date/short-date';
import { RmUnderScorePipe } from './rm-under-score/rm-under-score';
@NgModule({
	declarations: [
		ShortDatePipe,
		RmUnderScorePipe
	],
	imports: [],
	exports: [
		ShortDatePipe,
		RmUnderScorePipe
	]
})
export class PipesModule {}
