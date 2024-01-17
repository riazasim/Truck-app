import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractProperty'
})
export class ExtractPropertyPipe implements PipeTransform {

  transform(list: any[], property: string): string {
    if (!list?.length) {
      return '-';
    }

    return list.map(e => e[property]).join(', ');
  }

}
