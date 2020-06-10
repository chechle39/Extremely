using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class ClientRepository : Repository<Client>, IClientRepository
    {
        public ClientRepository(XBookContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ClientViewModel>> GetAllClientAsync(ClientSerchRequest request)
        {
            var listData = new List<ClientViewModel>();
            if (!string.IsNullOrEmpty(request.ClientKeyword))
            {
                var keyWord = "%" + request.ClientKeyword + "%";
                var data = from c in Entities
                           where EF.Functions.Like(c.clientName, keyWord) || EF.Functions.Like(c.address, keyWord) || EF.Functions.Like(c.email, keyWord) || EF.Functions.Like(c.taxCode, keyWord)
                           select c;
                listData = data.ProjectTo<ClientViewModel>().Take(20).ToList();
            }
            else if (string.IsNullOrEmpty(request.ClientKeyword))
            {
                listData = await Entities.ProjectTo<ClientViewModel>().Take(20).ToListAsync();
            }
            return listData;
        }

        public async Task<string> GetAllClientByID(long? id)
        {
            var listData = await Entities.ProjectTo<ClientViewModel>().Where(x => x.ClientId == id).ToListAsync();
            return listData[0].Address;
        }

        public async Task<ClientViewModel> GetClientByClientName(string clientName)
        {
            var data = await Entities.Where(client => client.clientName == clientName).ProjectTo<ClientViewModel>().AsNoTracking().FirstOrDefaultAsync();
            return data;
        }

        public async Task<IEnumerable<ClientViewModel>> GetAllClientData()
        {
           var data = await Entities.ProjectTo<ClientViewModel>().AsNoTracking().ToListAsync();
            return data;
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
