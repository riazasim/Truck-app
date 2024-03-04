import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'waitingTime'
})
export class WaitingTimePipe implements PipeTransform {

 public transform(schedulingDate: string, timeSlot: string): string {
    const formattedSchedulingDate = new Date(`${schedulingDate.slice(0, 11)}T${timeSlot}.000`);

    const duration = moment.duration(moment(new Date()).diff(formattedSchedulingDate));

    const hours = Math.trunc(duration.asHours());

    const minutes = Math.abs(Math.trunc(duration.asMinutes() % 60));

    const formattedMinutes = `${minutes < 10 ? `0${minutes}`: minutes}`;

    const formattedHours = hours < 0 && hours < 10 ? `-0${Math.abs(hours)}`:
                           hours < 10 ? `0${hours}`: hours;

    return `${formattedHours}:${formattedMinutes}`;
  }
}