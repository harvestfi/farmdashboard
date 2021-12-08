import {AfterViewInit, Component} from '@angular/core';
import {ViewTypeService} from '@data/services/view-type.service';
import {UniswapDto} from '@data/models/uniswap-dto';
import {UniswapService} from '@data/services/http/uniswap.service';
import {Paginated} from '@data/models/paginated';
import { DestroyService } from '@data/services/destroy.service';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-uni-history-dialog',
  templateUrl: './uni-history-dialog.component.html',
  styleUrls: ['./uni-history-dialog.component.scss'],
  providers: [DestroyService],
})
export class UniHistoryDialogComponent implements AfterViewInit {
  dtos: UniswapDto[] = [];
  paginatedDtos: Paginated<UniswapDto> = {
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
      private destroy$: DestroyService,
  ) {
  }

  ngAfterViewInit(): void {
    // TODO: This needs to use the actual endpoint :)
    this.getUniDataForPage(0);
  }

  getUniDataForPage(pageNumber): void {
    this.txHistory.getUniswapPaginatedTxHistoryData(pageNumber, 10, this.minAmount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        response.data = response.data.map((dto) => {
          UniswapDto.round(dto);
          return dto;
        });
        this.paginatedDtos = response;
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

  handleFilterUpdate($event): void {
    this.getUniDataForPage(0);
  }

  getDtos(): Array<UniswapDto> {
    return this.paginatedDtos.data.sort((a, b) => b.blockDate - a.blockDate);
  }
}
