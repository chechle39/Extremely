using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IBuyInvoiceService
    {
        Task<bool> CreateBuyInvoice(BuyInvoiceModelRequest BuyInvoiceViewModel);
        Task<bool> DeleteBuyInvoice(List<Deleted> request);
        Task<BuyInvoiceViewModel> GetALlDF();
        Task<BuyInvoiceViewModel> GetLastBuyInvoice();
        Task<bool> Update(BuyInvoiceViewModel buyInvoiceViewModel);
        Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoiceById(long id);


    }
}
