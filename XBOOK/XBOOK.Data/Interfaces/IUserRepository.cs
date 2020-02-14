using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace XBOOK.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> checkUserAcount();

    }
}
