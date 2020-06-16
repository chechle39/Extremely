using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Interfaces
{
    public interface ILibTaxBuyInvoiceRepository
    {
        TaxBuyInvoice CreateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel);
        Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceBySaleInvId(string taxInvoiceNumber);
        Task<bool> UpdateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel, string oldTaxInvoiceNumber);
        Task<TaxBuyInvoice> GetLastInvoice();
        Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceById(long id);
    }
}
