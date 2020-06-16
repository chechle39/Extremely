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
        Task<bool> CreateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxBuyInvoiceViewModel);
        Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceByBuyInvId(string taxInvoiceNumber);
        Task<bool> UpdateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel);
        Task<TaxBuyInvoice> GetLastInvoice();
        Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceById(long id);
        Task<bool> removeTaxBuyInv(long id);
    }
}
