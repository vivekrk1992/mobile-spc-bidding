import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rmUnderScore',
})
export class RmUnderScorePipe implements PipeTransform {
  transform(value: string) {
    return value.split('_').join(' ');
  }
}
