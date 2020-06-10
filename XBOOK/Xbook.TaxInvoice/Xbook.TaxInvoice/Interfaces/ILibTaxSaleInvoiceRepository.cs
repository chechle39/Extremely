using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Interfaces
{
    public interface ILibTaxSaleInvoiceRepository
    {
        Task<bool> CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel);
        Task<IEnumerable<TaxSaleInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber);
        Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel, string oldTaxInvoiceNumber);
        Task<TaxSaleInvoice> GetLastInvoice();
        Task<IEnumerable<TaxSaleInvoice>> GetTaxSaleInvoiceById(long id);
    }
}
