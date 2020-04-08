import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_URI } from '../../../../environments/app.config';
import { BaseService } from '../../../shared/service/base.service';
import { PurchaseChartView, DashboardRequest, BalanceChartView, SaleInvoiceReportView, SaleChartView, AllChartView } from '../models/dashboard/dashboard.model';

@Injectable()
export class DashboardService extends BaseService {
  getAllChart(): Observable<AllChartView> {
    return this.get<any>(`${API_URI.getAllChart}`);
  }
  getPurchaseChart(request: DashboardRequest): Observable<PurchaseChartView> {
    return this.post<any>(`${API_URI.getPurchaseChart}`, request);
  }
  getSaleChart(request: DashboardRequest): Observable<SaleChartView> {
    return this.post<any>(`${API_URI.getSaleChart}`, request);
  }
  getSaleInvoiceReport(request: DashboardRequest): Observable<SaleInvoiceReportView> {
    return this.post<any>(`${API_URI.getSaleInvoiceReport}`, request);
  }
  getBalanceChart(request: DashboardRequest): Observable<BalanceChartView> {
    return this.post<any>(`${API_URI.getBalanceChart}`, request);
  }
}
