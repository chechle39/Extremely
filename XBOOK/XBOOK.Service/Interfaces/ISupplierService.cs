using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISupplierService
    {
        Task<IEnumerable<SupplierViewModel>> GetAllSupplier(ClientSerchRequest request);
        Task<bool> CreateSupplier(SupplierCreateRequest request);
        Task<SupplierViewModel> GetSupplierById(int id);
        Task<IEnumerable<SupplierViewModel>> SerchClient(string keyword);
        Task<bool> UpdateSupplier(SupplierCreateRequest request);
        Task<bool> DeletedSupplier(List<requestDeleted> request);
    }
}
