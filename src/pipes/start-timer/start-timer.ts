import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'startTimer',
})
export class StartTimerPipe implements PipeTransform {

  transform(value: any) {
    return value.startTimer();
  }
}
