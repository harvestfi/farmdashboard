import {Pipe, PipeTransform} from '@angular/core';
import {HarvestDto} from '@data/models/harvest-dto';

@Pipe({
  name: 'harvestFilter',
  pure: false
})
export class HarvestFilterPipe implements PipeTransform {
  tmp = [];

  transform(dtos: HarvestDto[], minUsdAmount: number, vault: string): HarvestDto[] {
    if (!dtos || ((!minUsdAmount || minUsdAmount === 0) && (!vault || vault === 'all'))) {
      return dtos;
    }
    this.tmp = [];
    const arr = dtos.filter(dto => dto.usdAmount > minUsdAmount && (!vault || vault === 'all' || dto.vault === vault));
    return arr;
  }

}
