import { Pipe, PipeTransform } from '@angular/core';
import { differenceInDays } from 'date-fns';

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

    const days: number = differenceInDays(new Date(), new Date(date));
    return `${ days } day${ days % 1 === 0 ? 's' : '' } ago`;
  }

  /**
   * Checks if timestamp is in seconds and covert to milliseconds
   */
  checkTimestamp(timestamp: number): number {
    const isInSeconds = timestamp < 4000000000;
    if (isInSeconds) {
      timestamp *= 1000;
    }
    return timestamp;
  }
}
