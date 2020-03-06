import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CashFlowComponent } from './cash-flow/cash-flow.component';
import { ChartModule } from 'angular2-chartjs';
import { NbButtonModule, NbCardModule, NbSelectModule } from '@nebular/theme';
import { SalesFiguresComponent } from './sales-figures/sales-figures.component';
import { SaleChartComponent } from './sale-chart/sale-chart.component';
import { PurchaseChartComponent } from './purchase-chart/purchase-chart.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    NbButtonModule,
    NbCardModule,
    NbSelectModule,
  ],
  declarations: [
    DashboardComponent,
    CashFlowComponent,
    SalesFiguresComponent,
    SaleChartComponent,
    PurchaseChartComponent,
  ],
})
export class DashboardModule { }
