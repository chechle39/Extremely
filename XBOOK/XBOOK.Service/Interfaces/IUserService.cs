using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IUserService
    {
        Task<bool> checkUserAcount();
        Task<List<ApplicationUserViewModel>> GetAllAsync();
        Task<bool> AddAsync(ApplicationUserViewModel userVm);
        Task UpdateAsync(ApplicationUserViewModel userVm);
        Task DeleteAsync(int id);

    }
}
