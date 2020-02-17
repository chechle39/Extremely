using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IRoleService
    {
        Task<List<ApplicationRoleViewModel>> GetAllAsync();
        Task<bool> AddAsync(ApplicationRoleViewModel roleVm);
        Task UpdateAsync(ApplicationRoleViewModel roleVm);
    }
}
