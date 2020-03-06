using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IPermissionRepository
    {
        Task<List<PermissionViewModel>> GetAllPermissAsync();
    }
}
