using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvoiceService
    {
      //  Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(SaleInvoiceListRequest request);
        void Update(SaleInvoiceViewModel saleInvoiceViewModel);
        Task<bool> CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel);
        Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id);
        Task<bool> DeletedSaleInv(List<requestDeleted> request);
        SaleInvoiceViewModel GetALlDF();
        SaleInvoiceViewModel GetLastInvoice();
       // Task<TaxSaleInvoice> CheckSaleInvoiceById(string taxNum);
    }
}
