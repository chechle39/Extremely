using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IClientServiceDapper
    {
        Task<IEnumerable<ClientViewModel>> GetClientAsync(ClientSerchRequest request);
    }
}
