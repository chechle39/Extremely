import { BaseModel } from '../../../../shared/model/base.model';


export class AllChartView {
  public chart1: SaleChartView;
  public chart2: PurchaseChartView;
  public chart3: BalanceChartView;
  public chart4: SaleInvoiceReportView;
}

export class PurchaseChartView {
  public chart: any;
  public ammountOfItemOutstanding: number;
  public outstanding: number;
  public ammountOfItemOverduce: number;
  public overduce: number;
}

export class SaleChartView {
  public chart: any;
  public ammountOfItemOutstanding: number;
  public outstanding: number;
  public ammountOfItemOverduce: number;
  public overduce: number;
}

export class BalanceChartView {
  public chart: any;
  public cashBalance: number;
}

export class SaleInvoiceReportView {
  public chart: any;
}

export class DashboardRequest {
  public interval: string;
}
