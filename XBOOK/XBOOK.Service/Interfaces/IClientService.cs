using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IClientService
    {
        Client CreateClient(ClientCreateRequet request);
        Task<IEnumerable<ClientViewModel>> GetClientById(int id);
        Task<IEnumerable<ClientViewModel>> GetAllClient(ClientSerchRequest request);
        Task<IEnumerable<ClientViewModel>> SerchClient(string keyword);

    }
}
