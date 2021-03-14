import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../services/statistic.service';
import type { Period } from '../Abi';
import { times } from '../Abi';

export type Mode = 'shares' | 'tvl' 

@Component({
  selector: 'app-statistic-board-page',
  templateUrl: './statistic-board-page.component.html',
  styleUrls: ['./statistic-board-page.component.css']
})
export class StatisticBoardPageComponent implements OnInit {
  selectedPeriod: Period = times[2];
  preriodValues: Period[] = times;
  isLoading = false;
  
  mode: Mode = 'shares'

  constructor(private statistic: StatisticService) {}

  ngOnInit(): void {
    this.statistic.init()
  }
  
  selectPeriod(period: Period): void {
    this.showLoader()
    this.selectedPeriod = period;
  }

  switchMode(mode: Mode) {
    this.showLoader()
    this.mode = mode;

  }

  showLoader() {
    this.isLoading = true;
    console.log('= = = this.isLoading', this.isLoading)
  }

  hideLoader() {
    this.isLoading = false;
    console.log('= = = this.isLoading', this.isLoading)
  }
}
