using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.EntitiesDBCommon;

namespace XBOOK.Service.Interfaces
{
    public interface IUserCommonService
    {
        Task<AppUserCommon> FindUserCommon(string email);

    }
}
