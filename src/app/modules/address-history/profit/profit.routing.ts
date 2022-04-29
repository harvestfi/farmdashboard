import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { ProfitComponent } from "@modules/address-history/profit/profit.component";



const routes: Routes = [
  {
    path: '',
    component: ProfitComponent,
  },
  {
    path: ':address',
    component: ProfitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfitRouting { }
