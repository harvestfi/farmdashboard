import {Component, HostListener, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewTypeService} from '@data/services/view-type.service';
import {UserSettings} from '@core/user-settings';
import {CustomModalComponent} from '@shared/custom-modal/custom-modal.component';
import {SideMenuService} from '@data/services/side-menu.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-side-menu',
  templateUrl: './main-side-menu.component.html',
  styleUrls: ['./main-side-menu.component.scss'],
  animations: [
    trigger('openMenu', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.45s')
      ]),
    ]),
  ]
})
export class MainSideMenuComponent {
  @ViewChild('collapsibleArea', {static: true}) collapsibleArea;
  @ViewChild('allStatsDialog') private allStatsDialog: CustomModalComponent;
  @ViewChild('tvlDialog') private tvlDialog: CustomModalComponent;
  @ViewChild('incomeDialog') private incomeDialog: CustomModalComponent;
  @ViewChild('psApyDialog') private psApyDialog: CustomModalComponent;
  @ViewChild('weeklyProfitDialog') private weeklyProfitDialog: CustomModalComponent;
  @ViewChild('weeklyRewardsDialog') private weeklyRewardsDialog: CustomModalComponent;
  @ViewChild('farmBuybackDialog') private farmBuybackDialog: CustomModalComponent;
  @ViewChild('savedFeesDialog') private savedFeesDialog: CustomModalComponent;
  @ViewChild('userBalancesDialog') private userBalancesDialog: CustomModalComponent;
  @ViewChild('downloadHistoricDataDialog') private downloadHistoricDataDialog: CustomModalComponent;

  constructor(public viewTypeService: ViewTypeService,
              private sideMenuService: SideMenuService,
              public router: Router,
              private modalService: NgbModal) {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width > 1600) {
          this.sideMenuService.setSideMenuState(true);
      }
  }

  @HostListener('window:resize', ['$event'])
  handleScreenResize($event: any): void {
      const newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (newWidth > 1600) {
          this.sideMenuService.setSideMenuState(true);
      }
  }

  get homeRoute(): boolean {
      return this.router.isActive('/', true);
  }

  get chartRoute(): boolean {
      return this.router.isActive('charts', false);
  }

  get chartApyHistoryRoute(): boolean {
      return this.router.isActive('charts/ps-apy-history', true);
  }

  get chartWeeklyProfitHistoryRoute(): boolean {
      return this.router.isActive('charts/weekly-profit-history', true);
  }

  get chartFarmBuyBacksRoute(): boolean {
      return this.router.isActive('charts/farm-buybacks', true);
  }

  get chartSavedGasFeesRoute(): boolean {
      return this.router.isActive('charts/saved-gas-fees', true);
  }

  get rewardsHistoryRoute(): boolean {
      return this.router.isActive('rewards-history', true);
  }

  get downloadsRoute(): boolean {
      return this.router.isActive('downloads', true);
  }

  get userBalancesRoute(): boolean {
      return this.router.isActive('user-balances', true);
  }

  get sideMenuState(): any {
    return this.sideMenuService.getSideMenuState();
  }

  toggleMenu(): void {
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (width <= 1600) {
          this.sideMenuService.setSideMenuState(!this.sideMenuState);
      }
  }

  openAllStatsDialog(): void {
    this.allStatsDialog.open();
    this.toggleMenu();
  }

  openTvlDialog(): void {
    this.tvlDialog.open();
    this.toggleMenu();
  }

  openIncomeDialog(): void {
    this.incomeDialog.open();
    this.toggleMenu();
  }

  openPsApyDialog(): void {
    this.psApyDialog.open();
    this.toggleMenu();
  }

  openMain(): void {
    this.modalService.dismissAll();
    this.toggleMenu();
    this.router.navigateByUrl('');
    this.collapsibleArea.closeCollapseArea();
  }

  openPsApyHistory(): void {
    this.modalService.dismissAll();
    this.toggleMenu();
    this.router.navigateByUrl('charts/ps-apy-history');
  }

  openWeeklyProfitHistory(): void {
    this.modalService.dismissAll();
    this.toggleMenu();
    this.router.navigateByUrl('charts/weekly-profit-history');
  }
  openFarmBuyBacks(): void {
    this.modalService.dismissAll();
    this.toggleMenu();
    this.router.navigateByUrl('charts/farm-buybacks');
  }

  openSavedGasFees(): void {
    this.modalService.dismissAll();
    this.toggleMenu();
    this.router.navigateByUrl('charts/saved-gas-fees');
  }

  openRewardsHistory(): void {
    this.modalService.dismissAll();
    this.toggleMenu();
    this.router.navigateByUrl('rewards-history');
  }

  openDownloads(): void {
      this.modalService.dismissAll();
      this.toggleMenu();
      this.router.navigateByUrl('downloads');
  }

  openUserBalances(): void {
      this.modalService.dismissAll();
      this.toggleMenu();
      this.router.navigateByUrl('user-balances');
  }

  openWeeklyProfitDialog(): void {
    this.weeklyProfitDialog.open();
    this.toggleMenu();
  }

  openWeeklyRewardsDialog(): void {
    this.weeklyRewardsDialog.open();
    this.toggleMenu();
  }

  openFarmBuybacksDialog(): void {
    this.farmBuybackDialog.open();
    this.toggleMenu();
  }

  openSavedFeesDialog(): void {
    this.savedFeesDialog.open();
    this.toggleMenu();
  }


  openUserBalancesDialog(): void {
    this.userBalancesDialog.open();
    this.toggleMenu();
  }

  openDownloadHistoricDataDialog(): void {
    this.downloadHistoricDataDialog.open();
    this.toggleMenu();
  }
}
