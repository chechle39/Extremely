using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Data.Repositories
{
    public class ClientRepository : Repository<Client>, IClientRepository
    {
        public ClientRepository(DbContext context) : base(context)
        {
        }

        public IEnumerable<Client> GetAllClient()
        {
            var ListClient = Entities.Include(x => x.SaleInvoices);
            return ListClient;
        }

        public bool remiveClient(long id)
        {
            var ListClient = Entities.Where(x=>x.clientID == id).ToList();
            Entities.Remove(ListClient[0]);
            return true;
        }

        public bool SaveClient(ClientCreateRequet rs)
        {
            var update = AutoMapper.Mapper.Map<ClientCreateRequet, Client>(rs);
            var createCl = Entities.Add(update);
            return true;
        }

        public bool UpdateCl(ClientCreateRequet rs)
        {
            var update = AutoMapper.Mapper.Map<ClientCreateRequet, Client>(rs);
            var updatecl = Entities.Update(update);
            return true;
        }
    }
}
