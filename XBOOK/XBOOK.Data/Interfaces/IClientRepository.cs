using System.Collections.Generic;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;

namespace XBOOK.Data.Interfaces
{
    public interface IClientRepository : IRepository<Client>
    {
        IEnumerable<Client> GetAllClient();
    }
}
