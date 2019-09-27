using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvoiceService
    {
        Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(string keyword, string startDate, string endDate, bool searchConditions);
        bool Update(SaleInvoiceViewModel saleInvoiceViewModel);
        bool CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel);
    }
}
