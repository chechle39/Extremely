using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.EntitiesDBCommon;

namespace XBOOK.Data.Interfaces
{
    public interface IUserCommonRepository
    {
        Task<AppUserCommon> FindUserCommon(string email);
    }
}
