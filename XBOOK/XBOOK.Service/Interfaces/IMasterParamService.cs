using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IMasterParamService
    {
        Task<IEnumerable<MasterParamViewModel>> GetAllMaster();
        Task CreateMasterParam(List<MasterParamViewModel> request);
        Task UpdateMaster(List<MasterParamViewModel> request);
        Task<IEnumerable<MasterParamViewModel>> GetMasterById(string id);
        bool DeleteMaster(List<requestDeletedMaster> request);
        Task<IEnumerable<MasterParamViewModel>> GetMasTerByMoneyReceipt();
        Task<IEnumerable<MasterParamViewModel>> GetMasTerByPaymentReceipt();
        Task<IEnumerable<MasterParamViewModel>> GetMasTerByPaymentType();
    }
}
