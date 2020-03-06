using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IFunctionsRepository
    {
        Task<List<MenuModel>> GetMenu(ClaimsPrincipal user);
        Task<List<FunctionViewModel>> GetAllFunction();
    }
}
