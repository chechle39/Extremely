using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IRoleService
    {
        Task<List<ApplicationRoleViewModel>> GetAllAsync(UserRequest rq);
        Task<bool> AddAsync(ApplicationRoleViewModel roleVm);
        Task UpdateAsync(ApplicationRoleViewModel roleVm);
        Task DeleteAsync(List<Deleted> rq);
        Task<ApplicationRoleViewModel> GetById(long id);
    }
}
