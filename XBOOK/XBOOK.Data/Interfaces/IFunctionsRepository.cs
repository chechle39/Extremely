using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Data.Interfaces
{
    public interface IFunctionsRepository
    {
        Task<List<MenuModel>> GetMenu();
    }
}
