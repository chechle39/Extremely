using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IDebitageServiceDapper
    {
        Task<IEnumerable<DebitAgeViewodel>> GetDebitageServiceDapperAsync(DebitageModelSearchRequest request);
    }
}
