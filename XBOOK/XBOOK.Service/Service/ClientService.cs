using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class ClientService : IClientService
    {
        private readonly IRepository<Client> _clientUowRepository;
        private readonly IUnitOfWork _uow;
        public ClientService(IUnitOfWork uow)
        {
            _uow = uow;
            _clientUowRepository = _uow.GetRepository<IRepository<Client>>();
        }
        public Client CreateClient(ClientCreateRequet request)
        {
            var clientCreate = Mapper.Map<ClientCreateRequet, Client>(request);
            var client = new Client()
            {
                clientID = 0,
                address = request.Address,
                clientName = request.ClientName,
                contactName = request.ContactName,
                email = request.Email,
                note = request.Note,
                Tag = request.Tag,
                taxCode = request.TaxCode,
            };
            _clientUowRepository.AddData(client);
            _uow.SaveChanges();
            return client;
        }

        public async Task<IEnumerable<ClientViewModel>> GetAllClient(ClientSerchRequest request)
        {
            if (!string.IsNullOrEmpty(request.ClientKeyword))
            {
                var listData = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
                var query = listData.Where(x => x.ClientName.Contains(request.ClientKeyword) || x.Address.Contains(request.ClientKeyword)|| x.Email.Contains(request.ClientKeyword)).ToList();
                return query;
            }
            else
            {
                return await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
            }
        }

        public async Task<IEnumerable<ClientViewModel>> GetClientById(int id)
        {
            return await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientId == id).ToListAsync();
        }

        public async Task<IEnumerable<ClientViewModel>> SerchClient(string keyword)
        {
            var lisClient = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
            var listWhere = lisClient.Where(x => x.ClientName == keyword).ToList();
            return listWhere;
        }
    }
}
