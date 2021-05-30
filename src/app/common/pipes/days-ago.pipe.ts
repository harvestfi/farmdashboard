import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'daysAgo',
})
export class DaysAgoPipe implements PipeTransform {
  /**
   * Accepts string as a date and number as a timestamp
   */
  transform(date: string | number): string {
    // check for timestamp
    if (typeof date === 'number') {
      date = this.checkTimestamp(date);
    }

    // @todo: to investigate if moment.js slows down performance, if yes, then remove it and refactor
    const days: number = moment().diff(date, 'days');
    return `${days} day${days % 1 === 0 ? 's' : ''} ago`;
  }

  /**
   * Checks if timestamp is in seconds and covert to milliseconds
   * because moment.js accepts timestamp in milliseconds only
   */
  checkTimestamp(timestamp: number): number {
    const isInSeconds = timestamp < 4000000000;
    if (isInSeconds) {
      timestamp *= 1000;
    }
    return timestamp;
  }
}
