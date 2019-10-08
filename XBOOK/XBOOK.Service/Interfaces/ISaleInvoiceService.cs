using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvoiceService
    {
        Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(SaleInvoiceListRequest request);
        Task Update(SaleInvoiceViewModel saleInvoiceViewModel);
        bool CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel);
    }
}
