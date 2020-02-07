using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IPurchaseReportDapper
    {
        Task<IEnumerable<PurchaseReportGroupViewModel>> GetPurchaseReportGroupAsync(PurchaseReportSerchRequest request);
        Task<IEnumerable<PurchaseReportViewModel>> GetAllPurchaseReportAsync(PurchaseReportSerchRequest request);
    }
}
