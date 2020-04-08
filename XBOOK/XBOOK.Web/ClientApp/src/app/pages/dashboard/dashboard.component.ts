import { Component, OnInit } from '@angular/core';
import { DashboardRequest, AllChartView, SaleInvoiceReportView } from '../_shared/models/dashboard/dashboard.model';
import { DashboardService } from '../_shared/services/dashboard.service';

@Component({
  selector: 'xb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  charts: AllChartView = new AllChartView();
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    const param = new DashboardRequest();
    param.interval = 'month';
    this.dashboardService.getAllChart().subscribe((data: AllChartView) => {
      this.charts = data;
    });
  }

}
