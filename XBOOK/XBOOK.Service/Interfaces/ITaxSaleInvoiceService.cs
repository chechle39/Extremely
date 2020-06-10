using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ITaxSaleInvoiceService
    {
        Task<IEnumerable<TaxInvoiceViewModel>> GetTaxSaleInvoiceById(long id);
        TaxSaleInvoice GetALlDF();
        TaxSaleInvoice GetLastInvoice();
        bool CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel);
        Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel);
        Task<bool> DeletedTaxSaleInv(List<requestDeleted> deleted);
    }
}
