import {Component, ViewChild} from '@angular/core';
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
  public modalRef: NgbModalRef;
  isDarkTheme = UserSettings.getColor() === 'dark';
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
      window.addEventListener('resize', (event) => {
          const newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          if (newWidth > 1600) {
              this.sideMenuService.setSideMenuState(true);
          }
      });
  }

  get homeRoute(): boolean {
      return this.router.isActive('', true);
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


  openUserBalances(): void {
    this.userBalancesDialog.open();
    this.toggleMenu();
  }

  openDownloadHistoricDataDialog(): void {
    this.downloadHistoricDataDialog.open();
    this.toggleMenu();
  }
}
