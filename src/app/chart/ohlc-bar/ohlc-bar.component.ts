import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {OhlcDto} from 'src/app/models/ohlc-dto';
import {ViewTypeService} from 'src/app/services/view-type.service';

@Component({
  selector: 'app-ohlc-bar',
  templateUrl: './ohlc-bar.component.html',
  styleUrls: ['./ohlc-bar.component.scss']
})
export class OhlcBarComponent implements OnChanges {
  @Input() data: OhlcDto;

  public isPositive: boolean;
  public open: string;
  public high: string;
  public low: string;
  public close: string;
  public difference: string;
  public movement: string;
  public volume: string;

  constructor(public vt: ViewTypeService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {currentValue} = changes.data ?? {};

    if (currentValue) {
      this.open = currentValue.open.toFixed(2);
      this.high = currentValue.high.toFixed(2);
      this.low = currentValue.low.toFixed(2);
      this.close = currentValue.close.toFixed(2);

      const difference = currentValue.close - currentValue.open;
      this.isPositive = difference >= 0;
      this.difference = `${this.isPositive ? '+' : ''}${difference.toFixed(2)}`;

      const movement = (currentValue.close * 100 / currentValue.open) - 100;
      this.movement = `${this.isPositive ? '+' : ''}${movement.toFixed(2)}%`;

      this.volume = currentValue.volume.toFixed(2);
    }
  }
}
