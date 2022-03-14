import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfitComponent } from './profit.component';
import { ProfitRouting } from "@modules/address-history/profit/profit.routing";
import {ReactiveFormsModule} from "@angular/forms";
import {SideMenuToggleModule} from "@layout/main-top-navigation/side-menu-toggle/side-menu-toggle.module";
import {ThemeSwitchModule} from "@layout/theme-switch/theme-switch.module";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
      ProfitComponent,
  ],
    imports: [
        CommonModule,
        ProfitRouting,
        ReactiveFormsModule,
        SideMenuToggleModule,
        ThemeSwitchModule,
        MatButtonModule,

    ],
})
export class ProfitModule { }
