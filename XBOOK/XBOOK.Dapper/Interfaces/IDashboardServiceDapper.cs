using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IDashboardServiceDapper
    {
        Task<SaleChartViewModel> getSaleChartDataAsync(DashboardRequest request);
        Task<PurchaseChartViewModel> getPurchaseChartDataAsync(DashboardRequest request);
        Task<SaleInvoiceReportViewModel> getSaleInvoiceReportAsync(DashboardRequest request);
        Task<BalanceChartViewModel> getBalanceChartDataAsync(DashboardRequest request);
    }
}
