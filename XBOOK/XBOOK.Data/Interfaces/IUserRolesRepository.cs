using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Data.Interfaces
{
    public interface IUserRolesRepository
    {
        Task<bool> RemoveUserRole(AppUserRoleModel request);
    }
}
