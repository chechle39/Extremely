using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface ISupplierServiceDapper
    {
        Task<IEnumerable<SupplierViewModel>> GetSupplierAsync(ClientSerchRequest request);
    }
}
