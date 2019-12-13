using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ITaxService
    {
        Task<IEnumerable<TaxViewModel>> GetAllTax();
        Task CreateTax(List<TaxViewModel> request);
        bool DeleteTax(List<requestDeleted> request);
    }
}
