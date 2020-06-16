using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ITaxBuySaleInvoiceService
    {
        Task<IEnumerable<TaxBuyInvoiceViewModel>> GetTaxBuyInvoiceById(long id);
        TaxBuyInvoice GetALlDF();
        TaxBuyInvoice GetLastInvoice();
        Task<bool> CreateTaxInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel);
        Task<bool> UpdateTaxInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel);
        Task<bool> DeletedTaxSaleInv(List<requestDeleted> deleted);
    }
}
