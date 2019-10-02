using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ITaxService
    {
        Task<IEnumerable<TaxViewModel>> GetAllTax();
        Task CreateTax(TaxViewModel request);
    }
}
