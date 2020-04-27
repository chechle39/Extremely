using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISupplierService
    {
        Task<IEnumerable<SupplierViewModel>> GetAllSupplier(ClientSerchRequest request);
        bool CreateSupplier(SupplierCreateRequest request);
        Task<SupplierViewModel> GetSupplierById(int id);
        Task<IEnumerable<SupplierViewModel>> SerchClient(string keyword);
        Task<bool> UpdateSupplierAsync(SupplierCreateRequest request);
        Task<bool> DeletedSupplier(List<requestDeleted> request);
        byte[] GetDataSupplierAsync(List<SupplierExportRequest> request);
        bool CreateSupplierImport(List<SupplierCreateRequest> request);
    }
}
