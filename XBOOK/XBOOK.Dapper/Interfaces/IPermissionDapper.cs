using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface IPermissionDapper
    {
        Task<IEnumerable<PermissionViewModel>> GetAppFncPermission(long userId);

    }
}
