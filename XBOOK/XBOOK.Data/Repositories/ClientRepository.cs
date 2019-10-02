using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;

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
    }
}
