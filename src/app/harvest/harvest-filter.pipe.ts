import {Pipe, PipeTransform} from '@angular/core';
import {HarvestDto} from '../models/harvest-dto';

@Pipe({
  name: 'harvestFilter',
  pure: false
})
export class HarvestFilterPipe implements PipeTransform {
  tmp = [];

  transform(dtos: HarvestDto[], minUsdAmount: number, vault: string): HarvestDto[] {
    if (!dtos || (!minUsdAmount && !vault)) {
      return dtos;
    }
    this.tmp = [];
    const arr = dtos.filter(dto => dto.usdAmount > minUsdAmount && (!vault || vault === 'all' || dto.vault === vault));
    for (const el of arr) {
      this.tmp.push(el);
    }
    return this.tmp;
  }

}
