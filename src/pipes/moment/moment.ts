import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  transform(value, args) {
    args = args || '';
    return args === 'ago' ? moment(value).fromNow() : moment(value).format(args);
  }
}
