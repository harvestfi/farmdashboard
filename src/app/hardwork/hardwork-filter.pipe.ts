import {Pipe, PipeTransform} from '@angular/core';
import {HardWorkDto} from '../models/hardwork-dto';

@Pipe({
  name: 'hardworkFilter',
  pure: false
})
export class HardworkFilterPipe implements PipeTransform {
  tmp = [];

  transform(dtos: HardWorkDto[],  vault: string): HardWorkDto[] {
    if (!dtos || ( !vault)) {
      return dtos;
    }
    this.tmp = [];
    const arr = dtos.filter(dto => (!vault || vault === 'all' || dto.vault === vault));
    for (const el of arr) {
      this.tmp.push(el);
    }
    return this.tmp;
  }

}
