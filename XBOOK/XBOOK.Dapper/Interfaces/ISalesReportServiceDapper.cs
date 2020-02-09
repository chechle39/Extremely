using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface ISalesReportServiceDapper
    {
        Task<IEnumerable<SalesReportGroupViewModel>> GetISalesReportServiceDapperAsync(SalesReportModelSearchRequest request);
        Task<IEnumerable<SalesReportViewModel>> GetISalesDataReportServiceDapperAsync(SalesReportModelSearchRequest request);
    }
}
