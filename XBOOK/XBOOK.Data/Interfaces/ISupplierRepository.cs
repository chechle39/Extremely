using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ISupplierRepository: IRepository<Supplier>
    {
        Task<Supplier> CreateSupplier(SupplierCreateRequest request);
        Task<bool> UpdateSupplier(SupplierCreateRequest request);
        Task<IEnumerable<SupplierViewModel>> GetAllSupplierAsync(ClientSerchRequest request);
        bool removeSupplier(long id);
    }
}
