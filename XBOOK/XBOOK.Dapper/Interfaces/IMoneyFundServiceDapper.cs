using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IMoneyFundServiceDapper
    {
        Task<IEnumerable<MoneyFundViewModelGroupViewModel>> GetIMoneyFundDapperServiceDapperAsync(MoneyFundRequest request);
        Task<IEnumerable<MoneyFundViewModel>> GetIMoneyFundDapperReportServiceDapperAsync(MoneyFundRequest request);
    }
}
