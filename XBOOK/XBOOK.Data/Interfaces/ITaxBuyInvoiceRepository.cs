using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ITaxBuyInvoiceRepository
    {
        Task<bool> CreateTaxBuyInvoice(TaxSaleInvoiceModelRequest taxBuyInvoiceViewModel);
        Task<IEnumerable<TaxBuyInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber);
        Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel);
        Task<TaxBuyInvoice> GetLastInvoice();
        Task<IEnumerable<TaxBuyInvoice>> GetTaxSaleInvoiceById(long id);
        Task<bool> removeTaxSaleInv(long id);
    }
}
