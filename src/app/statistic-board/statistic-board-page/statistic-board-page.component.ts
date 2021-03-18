import { Component, OnInit, OnChanges } from '@angular/core';
import { StatisticService } from '../../services/statistic.service';
import { Web3Service } from '../../services/web3.service'
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

  constructor(
    private statistic: StatisticService,
    private web3: Web3Service  
  ) {}

  async ngOnInit() {
    this.showLoader();
    await this.statistic.init();
    this.hideLoader();
    await this.web3.init()
  }
  
  async selectPeriod(period: Period) {
    this.showLoader();
    this.selectedPeriod = period;
    await this.statistic.handleTimeChange(period);
    this.hideLoader();
  }

  async switchMode(mode: Mode) {
    this.showLoader();
    this.mode = mode;
    await this.statistic.handleChange(mode);
    this.hideLoader();
  }

  get data() {
    // console.log(
    //   '- - - - charts',
    //   this.statistic.data
    // )
    return this.statistic.data.charts;
  }

  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }
}
