import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate',
})
export class ShortDatePipe implements PipeTransform {

  transform(value: string) {
    console.log(typeof value);
    let day = new Date(value).getDay()
    let month = new Date(value).getMonth()
    let year = new Date(value).getFullYear()
    return day + '-' + month + '-' + year;
  }
}
