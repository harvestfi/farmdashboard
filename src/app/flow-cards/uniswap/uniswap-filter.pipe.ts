import {Pipe, PipeTransform} from '@angular/core';
import {UniswapDto} from '../../models/uniswap-dto';

@Pipe({
  name: 'uniswapFilter',
  pure: false
})
export class UniswapFilterPipe implements PipeTransform {
  tmp = [];

  transform(dtos: UniswapDto[], minAmount: number): UniswapDto[] {
    if (!dtos || !minAmount) {
      return dtos;
    }
    this.tmp = [];
    const arr = dtos.filter(dto => dto.amount > minAmount);
    for (const el of arr) {
      this.tmp.push(el);
    }
    return this.tmp;
  }

}
