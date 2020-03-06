using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Service.Interfaces
{
    public interface IFunctionsService
    {
        Task<List<MenuModel>> GetMenu(ClaimsPrincipal user);
    }
}
