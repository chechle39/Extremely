using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface IPermissionDapper
    {
        Task<IEnumerable<PermissionViewModel>> GetAppFncPermission(long userId, AppUserCommon userCommon);
        Task<List<MenuModel>> GetMenu(long userId);
    }
}
