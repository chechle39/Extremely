using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IClientService
    {
        Task CreateClient(ClientCreateRequet request);
        IEnumerable<ClientViewModel> GetClientById(int id);
        Task<IEnumerable<ClientViewModel>> GetAllClient();
        Task<IEnumerable<ClientViewModel>> SerchClient(string keyword);

    }
}
