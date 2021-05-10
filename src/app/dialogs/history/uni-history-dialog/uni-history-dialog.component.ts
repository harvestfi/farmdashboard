import {AfterViewInit, Component} from '@angular/core';
import {StaticValues} from 'src/app/static/static-values';
import {ViewTypeService} from '../../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {UniswapDto} from '../../../models/uniswap-dto';
import {UniswapService} from '../../../services/http/uniswap.service';
import { Paginated } from 'src/app/models/paginated';


@Component({
  selector: 'app-uni-history-dialog',
  templateUrl: './uni-history-dialog.component.html',
  styleUrls: ['./uni-history-dialog.component.scss'],
})
export class UniHistoryDialogComponent implements AfterViewInit {
  dtos: UniswapDto[] = [];
  paginated_dtos: Paginated<UniswapDto> = {
    currentPage: 0,
    nextPage: -1,
    previousPage: -1,
    totalPages: 0,
    data: []
};
  txIds = new Set<string>();
  lowestBlockDate = 999999999999;
  disabled = false;
  minAmount = 0;

  constructor(
    private txHistory: UniswapService,
    public vt: ViewTypeService,
    private log: NGXLogger
  ) {
  }

  ngAfterViewInit(): void {
    // TODO: This needs to use the actual endpoint :)
    this.getUniDataForPage(0);
  }

  getUniDataForPage(page_number): void {
    this.txHistory.getUniswapPaginatedTxHistoryData(page_number, 10, this.minAmount)
    .subscribe(response => {
      this.paginated_dtos = response;
    });
  }

  nextPage($event): void {
    this.getUniDataForPage($event);
  }
  previousPage($event): void {
    this.getUniDataForPage($event);
  }
  selectPage($event): void {
    this.getUniDataForPage($event);
  }
  handleFilterUpdate(_$event): void {
    this.getUniDataForPage(0);
  }
}
