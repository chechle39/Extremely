using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ITaxSaleInvoiceRepository
    {
        TaxSaleInvoice CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel);
        Task<IEnumerable<TaxSaleInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber);
        Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel);
        Task<TaxSaleInvoice> GetLastInvoice();
        Task<IEnumerable<TaxSaleInvoice>> GetTaxSaleInvoiceById(long id);
        Task<bool> removeTaxSaleInv(long id);
    }
}
