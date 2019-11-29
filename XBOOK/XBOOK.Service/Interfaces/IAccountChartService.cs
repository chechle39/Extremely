using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IAcountChartService
    {

        Task<List<AccountChartViewModel>> GetAllAccount();
    }
}
