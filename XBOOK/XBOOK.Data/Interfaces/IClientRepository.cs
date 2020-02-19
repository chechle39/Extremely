using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IClientRepository : IRepository<Client>
    {
        bool SaveClient(ClientCreateRequet rs);
        bool UpdateCl(ClientCreateRequet rs);
        bool remiveClient(long id);
        Task<IEnumerable<ClientViewModel>> GetAllClientAsync(ClientSerchRequest request);
        Task<IEnumerable<ClientViewModel>> GetAllClientData();
    }
}
