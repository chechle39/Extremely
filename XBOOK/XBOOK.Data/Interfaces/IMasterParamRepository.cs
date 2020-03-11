using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IMasterParamRepository
    {
        bool DeleteMaster(List<requestDeletedMaster> request);
        Task<IEnumerable<MasterParamViewModel>> GetMasTerByMoneyReceipt();
        Task<IEnumerable<MasterParamViewModel>> GetMasTerByPaymentReceipt();
        Task<IEnumerable<MasterParamViewModel>> GetMasTerByPaymentType();
    }
}
