using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IUserService
    {
        Task<bool> checkUserAcount();
        Task<List<ApplicationUserViewModel>> GetAllAsync(UserRequest rq);
        Task<bool> AddAsync(ApplicationUserViewModel userVm);
        Task UpdateAsync(ApplicationUserViewModel userVm);
        Task DeleteAsync(List<Deleted> rq);
        Task<ApplicationUserViewModel> GetById(int id);

    }
}
