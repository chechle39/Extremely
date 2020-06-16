using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface ITaxBuyInvoiceServiceDapper
    {
        Task<IEnumerable<TaxBuyInvoiceViewModel>> GetTaxBuyInvoiceAsync(SaleInvoiceListRequest request);
    }
}
