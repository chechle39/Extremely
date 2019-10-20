using System.Collections.Generic;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;

namespace XBOOK.Data.Interfaces
{
    public interface IClientRepository : IRepository<Client>
    {
        IEnumerable<Client> GetAllClient();
        bool SaveClient(ClientCreateRequet rs);
        bool UpdateCl(ClientCreateRequet rs);
        bool remiveClient(long id);
    }
}
